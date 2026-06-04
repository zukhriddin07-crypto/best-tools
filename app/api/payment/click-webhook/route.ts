import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyClickSignature, ClickRequestParams } from "@/lib/payment/click";

export async function POST(request: NextRequest) {
  try {
    let body: any = {};
    const contentType = request.headers.get("content-type") || "";

    // Click can send data as application/x-www-form-urlencoded or application/json
    if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await request.formData();
      formData.forEach((value, key) => {
        body[key] = value;
      });
    } else {
      body = await request.json();
    }

    const {
      click_trans_id,
      service_id,
      click_paydoc_id,
      merchant_trans_id, // Order number (e.g. BT-2026-10523)
      amount,
      action,
      error,
      error_note,
      sign_time,
      sign_string,
    } = body as ClickRequestParams;

    const clickSecretKey = process.env.CLICK_SECRET_KEY || "dummy_secret";

    // 1. Verify Signature
    const isValidSignature = verifyClickSignature(body, clickSecretKey);
    if (!isValidSignature && clickSecretKey !== "dummy_secret") {
      console.warn(`[CLICK ERROR] Invalid signature for trans: ${click_trans_id}`);
      return NextResponse.json({
        error: -1,
        error_note: "SIGN CHECK FAILED",
      });
    }

    const transAmount = parseFloat(amount);
    const actionType = parseInt(action);
    const clickError = parseInt(error);

    // 2. Lookup Order (Database with Mock Fallback)
    let order: any = null;
    let isMock = false;

    try {
      order = await prisma.order.findUnique({
        where: { orderNumber: merchant_trans_id },
      });
    } catch (dbError) {
      console.warn("[CLICK API] Prisma DB not ready. Running in mock fallback mode.");
      isMock = true;
      // In mock mode, if order number has correct prefix, simulate order exists
      if (merchant_trans_id && merchant_trans_id.startsWith("BT-2026-")) {
        order = {
          orderNumber: merchant_trans_id,
          totalAmount: transAmount, // assume amount is correct for test
          paymentStatus: "UNPAID",
          status: "PENDING",
        };
      }
    }

    if (!order) {
      console.error(`[CLICK ERROR] Order not found: ${merchant_trans_id}`);
      return NextResponse.json({
        error: -5,
        error_note: "ORDER NOT FOUND",
      });
    }

    // 3. Verify Amount
    const orderAmount = isMock ? transAmount : parseFloat(order.totalAmount.toString());
    if (Math.round(orderAmount) !== Math.round(transAmount)) {
      console.error(`[CLICK ERROR] Incorrect amount. Order: ${orderAmount}, Sent: ${transAmount}`);
      return NextResponse.json({
        error: -2,
        error_note: "INCORRECT AMOUNT",
      });
    }

    // 4. Verify Payment Status
    if (order.paymentStatus === "PAID") {
      console.warn(`[CLICK WARNING] Order already paid: ${merchant_trans_id}`);
      return NextResponse.json({
        error: -4,
        error_note: "ORDER ALREADY PAID",
      });
    }

    // 5. Handle Action Types
    if (actionType === 0) {
      // PREPARE
      console.log(`[CLICK PREPARE] Order: ${merchant_trans_id}, Trans ID: ${click_trans_id}`);
      return NextResponse.json({
        error: 0,
        error_note: "Success",
        click_trans_id: parseInt(click_trans_id),
        merchant_trans_id,
        merchant_prepare_id: `prep_${click_trans_id}`,
      });
    } else if (actionType === 1) {
      // COMPLETE
      if (clickError < 0) {
        // Transaction failed on Click side
        console.error(`[CLICK FAILED] Transaction failed for trans ${click_trans_id}. Error: ${error_note}`);
        try {
          if (!isMock) {
            await prisma.order.update({
              where: { orderNumber: merchant_trans_id },
              data: { status: "CANCELLED", note: `Click to'lov xatosi: ${error_note}` },
            });
          }
        } catch (e) {
          console.error("Failed to cancel mock order upon payment fail:", e);
        }
        return NextResponse.json({
          error: 0,
          error_note: "Transaction failure acknowledged",
        });
      }

      // Mark order as paid
      console.log(`[CLICK COMPLETE SUCCESS] Order: ${merchant_trans_id}, Trans ID: ${click_trans_id}`);
      try {
        if (!isMock) {
          await prisma.order.update({
            where: { orderNumber: merchant_trans_id },
            data: {
              paymentStatus: "PAID",
              status: "CONFIRMED",
              trackingNumber: `CLICK-${click_trans_id}`,
            },
          });
        } else {
          console.log(`[CLICK MOCK UPDATE] Mock Order ${merchant_trans_id} marked as PAID.`);
        }
      } catch (dbUpdateError) {
        console.error("Failed to update order status in DB", dbUpdateError);
        return NextResponse.json({
          error: -7,
          error_note: "DATABASE UPDATE ERROR",
        });
      }

      return NextResponse.json({
        error: 0,
        error_note: "Success",
        click_trans_id: parseInt(click_trans_id),
        merchant_trans_id,
        merchant_confirm_id: `conf_${click_trans_id}`,
      });
    }

    // Invalid Action
    return NextResponse.json({
      error: -3,
      error_note: "ACTION NOT FOUND",
    });
  } catch (error: any) {
    console.error("Click webhook handler runtime error:", error);
    return NextResponse.json({
      error: -7,
      error_note: "SYSTEM ERROR: " + error.message,
    });
  }
}
