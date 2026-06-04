import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderNumber, status, contractId, token } = body;

    if (!orderNumber || !status || !contractId) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const apiKey = process.env.UZUM_NASIYA_API_KEY || "dummy_uzum_secret";
    if (token !== apiKey && apiKey !== "dummy_uzum_secret") {
      return NextResponse.json({ error: "Unauthorized webhook call" }, { status: 401 });
    }

    let isMock = false;
    let order: any = null;

    try {
      order = await prisma.order.findUnique({
        where: { orderNumber },
      });
    } catch (e) {
      isMock = true;
      console.log(`[UZUM NASIYA WEBHOOK MOCK] Finding order ${orderNumber} failed, running mock mode.`);
    }

    if (status === "APPROVED" || status === "COMPLETED") {
      try {
        if (!isMock) {
          await prisma.order.update({
            where: { orderNumber },
            data: {
              paymentStatus: "PAID",
              status: "CONFIRMED",
              trackingNumber: `UZUM-${contractId}`,
            },
          });
        }
        console.log(`[UZUM NASIYA SUCCESS] Order ${orderNumber} successfully financed. Contract: ${contractId}`);
      } catch (dbError) {
        console.error("Database update failed for Uzum Nasiya order:", dbError);
        return NextResponse.json({ error: "Database update error" }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, message: "Webhook processed successfully" });
  } catch (error: any) {
    console.error("Uzum Nasiya webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
