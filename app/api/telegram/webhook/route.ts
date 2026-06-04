import { NextRequest, NextResponse } from "next/server";
import { sendTelegramMessage } from "@/lib/telegram";

export async function POST(request: NextRequest) {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    console.warn("[TELEGRAM BOT] TELEGRAM_BOT_TOKEN is not configured. Webhook active but ignoring request.");
    return NextResponse.json({ success: true, warning: "Token not set" });
  }

  try {
    const update = await request.json();
    const message = update.message;

    if (!message || !message.text) {
      return NextResponse.json({ success: true });
    }

    const chatId = String(message.chat.id);
    const text = message.text.trim();
    const firstName = message.from?.first_name || "Mijoz";

    if (text === "/start") {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
      
      const welcomeText = `Assalomu alaykum, <b>${firstName}</b>!\n\n` +
        `🛠 <b>Best Tools</b> premium elektr asboblar do'konining rasmiy botiga xush kelibsiz.\n\n` +
        `Bizda Bosch, Milwaukee, DeWalt, Makita kabi yetakchi brendlarning original asboblarini O'zbekiston bo'ylab kafolat bilan sotib olishingiz mumkin.\n\n` +
        `Sotib olishni boshlash uchun quyidagi <b>"🛍️ Do'konga o'tish"</b> tugmasini bosing:`;

      const replyMarkup = {
        inline_keyboard: [
          [
            {
              text: "🛍️ Do'konga o'tish (Mini App)",
              web_app: { url: siteUrl },
            },
          ],
          [
            {
              text: "📞 Kontaktlar / Biz haqimizda",
              callback_data: "about",
            },
          ],
        ],
      };

      await sendTelegramMessage(token, chatId, welcomeText, replyMarkup);
    } else {
      // Standard response for other inputs
      const echoText = `Hurmatli <b>${firstName}</b>, asboblar katalogini ko'rish yoki buyurtma berish uchun quyidagi tugma orqali Web ilovamizga kiring:`;
      const replyMarkup = {
        inline_keyboard: [
          [
            {
              text: "🛍️ Do'konga o'tish",
              web_app: { url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000" },
            },
          ],
        ],
      };

      await sendTelegramMessage(token, chatId, echoText, replyMarkup);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Telegram bot webhook router error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
