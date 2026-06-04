export async function sendTelegramMessage(
  token: string,
  chatId: string,
  text: string,
  replyMarkup?: any
): Promise<boolean> {
  if (!token || !chatId) {
    console.log(`[TELEGRAM MESSAGE MOCK] Chat ID: ${chatId}, Message: "${text}"`);
    return true;
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        reply_markup: replyMarkup,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`Telegram sendMessage API error: ${res.status} - ${errText}`);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Failed to send Telegram message:", error);
    return false;
  }
}

export async function sendAdminOrderNotification(
  orderNumber: string,
  totalAmount: number,
  customerName: string,
  phone: string,
  paymentMethod: string
): Promise<boolean> {
  const token = process.env.TELEGRAM_ADMIN_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;

  const text = `🚨 <b>YANGI BUYURTMA</b> 🚨\n\n` +
    `<b>Raqam:</b> #${orderNumber}\n` +
    `<b>Mijoz:</b> ${customerName}\n` +
    `<b>Telefon:</b> ${phone}\n` +
    `<b>Summa:</b> ${new Intl.NumberFormat("uz-UZ").format(totalAmount)} so'm\n` +
    `<b>To'lov:</b> ${paymentMethod}\n\n` +
    `🔗 <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/orders">Admin panelda ko'rish</a>`;

  if (!token || !chatId) {
    console.log(`[TELEGRAM ADMIN NOTIFICATION MOCK]\n${text.replace(/<[^>]*>/g, "")}`);
    return true;
  }

  return sendTelegramMessage(token, chatId, text);
}
