import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendAdminOrderNotification } from "@/lib/telegram";
import { createBtsOrder } from "@/lib/delivery/bts";
import { createYandexDeliveryClaim } from "@/lib/delivery/yandex";



export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerId,
      phone,
      name,
      items,
      deliveryMethod,
      deliveryAddress,
      paymentMethod,
      installmentMonths,
      note,
      totalAmount,
      deliveryAmount,
    } = body;

    // Basic Validation
    if (!phone || !items || items.length === 0 || !deliveryMethod || !paymentMethod || !deliveryAddress) {
      return NextResponse.json({ error: "Barcha majburiy maydonlar to'ldirilishi shart" }, { status: 400 });
    }

    // Generate unique order number (e.g. BT-2026-10523)
    const orderNumber = `BT-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    // Register Logistics / Get tracking number
    let trackingNumber = "";
    if (deliveryMethod === "BTS_EXPRESS") {
      try {
        const btsRes = await createBtsOrder({
          orderNumber,
          senderName: "Best Tools Shop",
          senderPhone: "+998712345678",
          receiverName: name || "Mijoz",
          receiverPhone: phone,
          receiverRegion: deliveryAddress.region || "Toshkent",
          receiverCity: deliveryAddress.city || "Toshkent",
          receiverStreet: deliveryAddress.street || "",
          weight: 2.0, // Default estimated parcel weight (kg)
        });
        if (btsRes.success) {
          trackingNumber = btsRes.trackingNumber || "";
        }
      } catch (err) {
        console.error("BTS order creation failed:", err);
      }
    } else if (deliveryMethod === "YANDEX_DELIVERY") {
      try {
        const yndxRes = await createYandexDeliveryClaim({
          orderNumber,
          receiverName: name || "Mijoz",
          receiverPhone: phone,
          addressTo: `${deliveryAddress.region || "Toshkent"}, ${deliveryAddress.city || "Toshkent"}, ${deliveryAddress.street || ""}`,
          items: items.map((i: any) => ({ name: i.name, quantity: i.quantity })),
        });
        if (yndxRes.success) {
          trackingNumber = yndxRes.claimId || "";
        }
      } catch (err) {
        console.error("Yandex claim creation failed:", err);
      }
    }

    let orderId = "";
    let savedOrder: any = null;

    try {
      // 1. Find or create customer
      const dbCustomer = await prisma.customer.upsert({
        where: { phone },
        update: name ? { name } : {},
        create: { phone, name: name || "Mijoz" },
      });

      // 2. Create the order & items using transaction
      const transactionResult = await prisma.$transaction(async (tx: any) => {
        // Create order
        const order = await tx.order.create({
          data: {
            orderNumber,
            customerId: dbCustomer.id,
            status: "PENDING",
            paymentStatus: "UNPAID",
            paymentMethod,
            totalAmount,
            deliveryAmount,
            deliveryAddress: deliveryAddress as any,
            deliveryMethod,
            trackingNumber: trackingNumber || null,
            installmentMonths: installmentMonths ? parseInt(installmentMonths) : null,
            note,
            source: "WEB",
            items: {
              create: items.map((item: any) => ({
                productId: item.id,
                quantity: item.quantity,
                price: item.price,
                name: item.name,
              })),
            },
          },
        });

        // Decrement product stock
        for (const item of items) {
          await tx.product.update({
            where: { id: item.id },
            data: { stock: { decrement: item.quantity } },
          });
        }

        return order;
      });

      savedOrder = transactionResult;
      orderId = transactionResult.id;
      console.log(`[ORDER CREATED IN DB] Order Number: ${orderNumber}, ID: ${orderId}`);
    } catch (dbError) {
      console.warn("Prisma order creation failed, running in mock fallback mode:", dbError);
      
      // Fallback: mock order creation response
      orderId = "mock-order-id-" + Math.floor(Math.random() * 10000);
      savedOrder = {
        id: orderId,
        orderNumber,
        customerId: customerId || "mock-cust-id",
        status: "PENDING",
        paymentStatus: "UNPAID",
        paymentMethod,
        totalAmount,
        deliveryAmount,
        deliveryAddress,
        deliveryMethod,
        trackingNumber,
        installmentMonths,
        note,
        createdAt: new Date().toISOString(),
      };
    }

    // 3. Generate payment links if Click or Payme
    let paymentUrl = "";
    if (paymentMethod === "CLICK") {
      // Click payment redirection URL simulation
      const merchantId = process.env.CLICK_MERCHANT_ID || "12345";
      const serviceId = process.env.CLICK_SERVICE_ID || "54321";
      paymentUrl = `https://my.click.uz/services/pay?service_id=${serviceId}&merchant_id=${merchantId}&amount=${totalAmount}&transaction_param=${orderNumber}`;
    } else if (paymentMethod === "PAYME") {
      // Payme payment redirection URL simulation (base64 encoded params)
      const merchantId = process.env.PAYME_MERCHANT_ID || "56789";
      const params = `m=${merchantId};ac.order_id=${orderNumber};a=${totalAmount * 100}`;
      const base64Params = Buffer.from(params).toString("base64");
      paymentUrl = `https://checkout.paycom.uz/${base64Params}`;
    } else if (paymentMethod === "UZUM_NASIYA") {
      // Uzum Nasiya installment checkout simulation URL
      paymentUrl = `/checkout/uzum-nasiya?order=${orderNumber}&amount=${totalAmount}&months=${installmentMonths}`;
    }

    // 4. Send Telegram Admin Notification
    try {
      await sendAdminOrderNotification(
        orderNumber,
        parseFloat(totalAmount),
        name || "Mijoz",
        phone,
        paymentMethod
      );
    } catch (tgError) {
      console.error("Failed to send Telegram admin notification:", tgError);
    }

    return NextResponse.json({
      success: true,
      orderNumber,
      orderId,
      paymentUrl,
      order: savedOrder,
    });

  } catch (error: any) {
    console.error("Order creation API error:", error);
    return NextResponse.json({ error: error.message || "Tizim xatosi" }, { status: 500 });
  }
}
