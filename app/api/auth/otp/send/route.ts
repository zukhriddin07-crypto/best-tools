import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendSms } from "@/lib/eskiz";

// In-memory fallback for local testing when database is not connected
export const mockOtpStore = new Map<string, { code: string; expiresAt: number }>();

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json({ error: "Telefon raqami kiritilishi shart" }, { status: 400 });
    }

    // Generate random 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiration

    // Format message
    const message = `Best Tools: Tasdiqlash kodi: ${code}. Kod 5 daqiqa davomida faol.`;

    // Try to send SMS
    const smsResult = await sendSms(phone, message);
    if (!smsResult.success) {
      console.warn("Eskiz SMS sending failed:", smsResult.error);
    }

    // Try saving to DB using Prisma
    try {
      await prisma.otpCode.create({
        data: {
          phone,
          code,
          expiresAt,
        },
      });
      console.log(`[OTP SENT] Code ${code} saved to Prisma DB for ${phone}`);
    } catch (dbError) {
      console.warn("Prisma DB not ready, storing OTP in-memory fallback:", dbError);
      mockOtpStore.set(phone, { code, expiresAt: expiresAt.getTime() });
    }

    return NextResponse.json({
      success: true,
      message: "SMS kod yuborildi",
      // Include mock fields to assist frontend development when real SMS is not configured
      mocked: smsResult.mock,
      code: smsResult.mock ? code : undefined, // expose code only in mock mode for easy testing
    });
  } catch (error: any) {
    console.error("OTP send endpoint error:", error);
    return NextResponse.json({ error: error.message || "Tizim xatosi" }, { status: 500 });
  }
}
