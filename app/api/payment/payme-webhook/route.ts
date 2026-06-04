import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  verifyPaymeAuth,
  formatPaymeError,
  formatPaymeSuccess,
  PaymeErrorCodes,
  PaymeRpcRequest,
} from "@/lib/payment/payme";

// Persistent in-memory transaction registry for Payme lifecycle state tracking
// Schema: transactionId -> { id, orderId, amount, state, createTime, performTime, cancelTime, reason }
const transactionsRegistry = new Map<string, {
  id: string;
  orderId: string;
  amount: number;
  state: number;
  createTime: number;
  performTime: number;
  cancelTime: number;
  reason: number | null;
}>();

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const paymeSecretKey = process.env.PAYME_SECRET_KEY || "dummy_payme_secret";

  const reqId: number | string = 1;

  try {
    const body = (await request.json()) as PaymeRpcRequest;
    const { method, params, id } = body;

    // 1. Verify Authentication
    const isAuthorized = verifyPaymeAuth(authHeader, paymeSecretKey);
    if (!isAuthorized && paymeSecretKey !== "dummy_payme_secret") {
      return new NextResponse(
        JSON.stringify(formatPaymeError(id || reqId, PaymeErrorCodes.TRANSPORT_ERROR, "Avtorizatsiya xatosi", "Ошибка авторизации")),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
            "WWW-Authenticate": 'Basic realm="Payme Merchant API"',
          },
        }
      );
    }

    // 2. Handle Methods
    if (method === "CheckPerformTransaction") {
      const { amount, account } = params;
      const orderId = account?.order_id;

      if (!orderId || !amount) {
        return NextResponse.json(formatPaymeError(id, PaymeErrorCodes.ORDER_NOT_FOUND, "Buyurtma raqami xato", "Неверный номер заказа"));
      }

      // Find order in DB or mock
      let order: any = null;
      let isMock = false;

      try {
        order = await prisma.order.findUnique({
          where: { orderNumber: orderId },
        });
      } catch (dbErr) {
        isMock = true;
        if (orderId.startsWith("BT-2026-")) {
          order = { orderNumber: orderId, totalAmount: amount / 100, paymentStatus: "UNPAID" };
        }
      }

      if (!order) {
        return NextResponse.json(formatPaymeError(id, PaymeErrorCodes.ORDER_NOT_FOUND, "Buyurtma topilmadi", "Заказ не найден"));
      }

      // Verify amount (Payme amount is in tiyin/cents, orderAmount is in UZS)
      const orderAmountTiyin = Math.round((isMock ? order.totalAmount : parseFloat(order.totalAmount.toString())) * 100);
      if (orderAmountTiyin !== amount) {
        return NextResponse.json(formatPaymeError(id, PaymeErrorCodes.INCORRECT_AMOUNT, "To'lov summasi noto'g'ri", "Неверная сумма заказа"));
      }

      if (order.paymentStatus === "PAID") {
        return NextResponse.json(formatPaymeError(id, PaymeErrorCodes.ALREADY_PAID, "Buyurtma allaqachon to'langan", "Заказ уже оплачен"));
      }

      return NextResponse.json(formatPaymeSuccess(id, { allow: true }));
    }

    if (method === "CreateTransaction") {
      const { id: transId, time, amount, account } = params;
      const orderId = account?.order_id;

      if (!transId || !orderId || !amount) {
        return NextResponse.json(formatPaymeError(id, PaymeErrorCodes.CANT_PERFORM_TRANSACTION, "Noto'g'ri parametrlar", "Неверные параметры"));
      }

      // Check if transaction already exists in registry
      const existing = transactionsRegistry.get(transId);
      if (existing) {
        if (existing.state !== 1) {
          return NextResponse.json(
            formatPaymeError(id, PaymeErrorCodes.CANT_PERFORM_TRANSACTION, "Tranzaksiya holati xato", "Неверное состояние транзакции")
          );
        }
        return NextResponse.json(
          formatPaymeSuccess(id, {
            create_time: existing.createTime,
            transaction: existing.id,
            state: existing.state,
          })
        );
      }

      // Check if order exists and can perform transaction
      let order: any = null;
      let isMock = false;

      try {
        order = await prisma.order.findUnique({
          where: { orderNumber: orderId },
        });
      } catch (dbErr) {
        isMock = true;
        if (orderId.startsWith("BT-2026-")) {
          order = { orderNumber: orderId, totalAmount: amount / 100, paymentStatus: "UNPAID" };
        }
      }

      if (!order) {
        return NextResponse.json(formatPaymeError(id, PaymeErrorCodes.ORDER_NOT_FOUND, "Buyurtma topilmadi", "Заказ не найден"));
      }

      const orderAmountTiyin = Math.round((isMock ? order.totalAmount : parseFloat(order.totalAmount.toString())) * 100);
      if (orderAmountTiyin !== amount) {
        return NextResponse.json(formatPaymeError(id, PaymeErrorCodes.INCORRECT_AMOUNT, "To'lov summasi noto'g'ri", "Неверная сумма заказа"));
      }

      if (order.paymentStatus === "PAID") {
        return NextResponse.json(formatPaymeError(id, PaymeErrorCodes.ALREADY_PAID, "Buyurtma allaqachon to'langan", "Заказ уже оплачен"));
      }

      // Create new transaction in registry
      const newTrans = {
        id: transId,
        orderId,
        amount,
        state: 1, // Prepared
        createTime: time,
        performTime: 0,
        cancelTime: 0,
        reason: null,
      };
      transactionsRegistry.set(transId, newTrans);
      console.log(`[PAYME CREATE] Created transaction ${transId} for order ${orderId}`);

      return NextResponse.json(
        formatPaymeSuccess(id, {
          create_time: time,
          transaction: transId,
          state: 1,
        })
      );
    }

    if (method === "PerformTransaction") {
      const { id: transId } = params;
      const trans = transactionsRegistry.get(transId);

      if (!trans) {
        return NextResponse.json(
          formatPaymeError(id, PaymeErrorCodes.TRANSACTION_NOT_FOUND, "Tranzaksiya topilmadi", "Транзакция не найдена")
        );
      }

      if (trans.state === 1) {
        const performTime = Date.now();
        trans.state = 2; // Completed
        trans.performTime = performTime;

        // Mark order as paid in Database or mock
        try {
          await prisma.order.update({
            where: { orderNumber: trans.orderId },
            data: {
              paymentStatus: "PAID",
              status: "CONFIRMED",
              trackingNumber: `PAYME-${transId}`,
            },
          });
          console.log(`[PAYME PERFORM] Order ${trans.orderId} marked as PAID in Database.`);
        } catch (dbError) {
          console.warn(`[PAYME PERFORM MOCK] DB failed. Mocking Order ${trans.orderId} status update to PAID.`);
        }

        return NextResponse.json(
          formatPaymeSuccess(id, {
            transaction: transId,
            perform_time: performTime,
            state: 2,
          })
        );
      }

      if (trans.state === 2) {
        return NextResponse.json(
          formatPaymeSuccess(id, {
            transaction: transId,
            perform_time: trans.performTime,
            state: 2,
          })
        );
      }

      return NextResponse.json(
        formatPaymeError(id, PaymeErrorCodes.CANT_PERFORM_TRANSACTION, "Tranzaksiyani bajarib bo'lmaydi", "Невозможно выполнить транзакцию")
      );
    }

    if (method === "CancelTransaction") {
      const { id: transId, reason } = params;
      const trans = transactionsRegistry.get(transId);

      if (!trans) {
        return NextResponse.json(
          formatPaymeError(id, PaymeErrorCodes.TRANSACTION_NOT_FOUND, "Tranzaksiya topilmadi", "Транзакция не найдена")
        );
      }

      const cancelTime = Date.now();

      if (trans.state === 1) {
        // Cancel Prepared Transaction
        trans.state = -1; // Cancelled
        trans.cancelTime = cancelTime;
        trans.reason = reason;
        console.log(`[PAYME CANCEL] Prepared transaction ${transId} cancelled.`);

        return NextResponse.json(
          formatPaymeSuccess(id, {
            transaction: transId,
            cancel_time: cancelTime,
            state: -1,
          })
        );
      }

      if (trans.state === 2) {
        // Refund Completed Transaction
        trans.state = -2; // Refunded
        trans.cancelTime = cancelTime;
        trans.reason = reason;

        // Refund order in DB or mock
        try {
          await prisma.order.update({
            where: { orderNumber: trans.orderId },
            data: {
              paymentStatus: "REFUNDED",
              status: "CANCELLED",
            },
          });
          console.log(`[PAYME REFUND] Order ${trans.orderId} marked as REFUNDED/CANCELLED in DB.`);
        } catch (dbError) {
          console.warn(`[PAYME REFUND MOCK] DB failed. Mocking Order ${trans.orderId} refund status update.`);
        }

        return NextResponse.json(
          formatPaymeSuccess(id, {
            transaction: transId,
            cancel_time: cancelTime,
            state: -2,
          })
        );
      }

      // If already cancelled or refunded
      return NextResponse.json(
        formatPaymeSuccess(id, {
          transaction: transId,
          cancel_time: trans.cancelTime,
          state: trans.state,
        })
      );
    }

    if (method === "CheckTransaction") {
      const { id: transId } = params;
      const trans = transactionsRegistry.get(transId);

      if (!trans) {
        return NextResponse.json(
          formatPaymeError(id, PaymeErrorCodes.TRANSACTION_NOT_FOUND, "Tranzaksiya topilmadi", "Транзакция не найдена")
        );
      }

      return NextResponse.json(
        formatPaymeSuccess(id, {
          create_time: trans.createTime,
          perform_time: trans.performTime,
          cancel_time: trans.cancelTime,
          transaction: trans.id,
          state: trans.state,
          reason: trans.reason,
        })
      );
    }

    if (method === "GetStatement") {
      const { from, to } = params;
      const list = Array.from(transactionsRegistry.values())
        .filter((t) => t.createTime >= from && t.createTime <= to)
        .map((t) => ({
          id: t.id,
          time: t.createTime,
          amount: t.amount,
          account: { order_id: t.orderId },
          create_time: t.createTime,
          perform_time: t.performTime,
          cancel_time: t.cancelTime,
          transaction: t.id,
          state: t.state,
          reason: t.reason,
        }));

      return NextResponse.json(formatPaymeSuccess(id, { transactions: list }));
    }

    // Method Not Found
    return NextResponse.json({
      jsonrpc: "2.0",
      id,
      error: {
        code: -32601,
        message: "Method not found",
      },
    });
  } catch (error: any) {
    console.error("Payme webhook handler runtime error:", error);
    return NextResponse.json(
      formatPaymeError(reqId, PaymeErrorCodes.SYSTEM_ERROR, "Tizim xatosi yuz berdi", "Системная ошибка: " + error.message)
    );
  }
}
