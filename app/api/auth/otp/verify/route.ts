import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mockOtpStore } from "../send/route";

export async function POST(request: NextRequest) {
  try {
    const { phone, code, name } = await request.json();

    if (!phone || !code) {
      return NextResponse.json({ error: "Telefon va kod kiritilishi shart" }, { status: 400 });
    }

    let isValid = false;

    // 1. Try verifying with Prisma Database
    try {
      const otpRecord = await prisma.otpCode.findFirst({
        where: {
          phone,
          code,
          used: false,
          expiresAt: { gte: new Date() },
        },
        orderBy: { createdAt: "desc" },
      });

      if (otpRecord) {
        isValid = true;
        // Mark code as used
        await prisma.otpCode.update({
          where: { id: otpRecord.id },
          data: { used: true },
        });
      }
    } catch (dbError) {
      console.warn("Prisma DB verify failed, checking in-memory fallback store:", dbError);
      
      // Fallback: Verify using in-memory store
      const stored = mockOtpStore.get(phone);
      if (stored && stored.code === code && stored.expiresAt >= Date.now()) {
        isValid = true;
        mockOtpStore.delete(phone); // Burn the code after use
      }
    }

    if (!isValid) {
      return NextResponse.json({ error: "Kod noto'g'ri yoki uning muddati tugagan" }, { status: 400 });
    }

    // 2. Register/Login customer
    let customer: any = null;

    try {
      customer = await prisma.customer.upsert({
        where: { phone },
        update: name ? { name } : {},
        create: {
          phone,
          name: name || "Mijoz",
        },
      });
      console.log(`[CUSTOMER DB SUCCESS] Customer ${phone} upserted in Prisma`);
    } catch (dbError) {
      console.warn("Prisma customer upsert failed, returning mock session data:", dbError);
      // Fallback: dummy customer data
      customer = {
        id: "mock-cust-id-" + Math.floor(Math.random() * 10000),
        phone,
        name: name || "Mijoz",
      };
    }

    // In a full implementation, we could set a session cookie or JWT here.
    // For now, we will return the customer info and success state.
    return NextResponse.json({
      success: true,
      message: "Kod muvaffaqiyatli tasdiqlandi",
      customer,
    });
  } catch (error: any) {
    console.error("OTP verify endpoint error:", error);
    return NextResponse.json({ error: error.message || "Tizim xatosi" }, { status: 500 });
  }
}
