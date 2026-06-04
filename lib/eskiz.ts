let cachedToken: string | null = null;
let tokenExpiresAt = 0;

async function getEskizToken(): Promise<string | null> {
  const email = process.env.ESKIZ_EMAIL;
  const password = process.env.ESKIZ_PASSWORD;

  if (!email || !password || email.includes("your@email.com")) {
    return null; // Force mock mode
  }

  // Token is valid for 30 days. Let's refresh if it expires within 1 day.
  const now = Date.now();
  if (cachedToken && tokenExpiresAt > now + 24 * 60 * 60 * 1000) {
    return cachedToken;
  }

  try {
    const res = await fetch("https://notify.eskiz.uz/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error("Failed to login to Eskiz");

    const data = await res.json();
    if (data?.data?.token) {
      cachedToken = data.data.token;
      // Set expiration to 29 days from now
      tokenExpiresAt = Date.now() + 29 * 24 * 60 * 60 * 1000;
      return cachedToken;
    }
  } catch (error) {
    console.error("Eskiz authentication error:", error);
  }

  return null;
}

export async function sendSms(phone: string, message: string): Promise<{ success: boolean; mock?: boolean; error?: string }> {
  // Clean phone number: remove '+' and keep digits
  const cleanPhone = phone.replace(/\D/g, "");

  const token = await getEskizToken();
  if (!token) {
    // Mock Mode fallback
    console.log(`[ESKIZ SMS MOCK] To: ${phone}, Message: "${message}"`);
    return { success: true, mock: true };
  }

  try {
    const from = process.env.ESKIZ_FROM || "4546";
    const res = await fetch("https://notify.eskiz.uz/api/message/sms/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        mobile_phone: cleanPhone,
        message,
        from,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Eskiz send error: ${errText}`);
    }

    const data = await res.json();
    if (data?.status === "waiting" || data?.status === "success") {
      return { success: true };
    }

    return { success: false, error: data?.message || "Unknown error" };
  } catch (error: any) {
    console.error("Failed to send Eskiz SMS:", error);
    return { success: false, error: error.message };
  }
}
