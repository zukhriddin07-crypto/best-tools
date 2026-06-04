export interface ProductAiResponse {
  name: string;
  nameRu: string;
  shortDesc: string;
  description: string;
  descriptionRu: string;
  specs: Record<string, string>;
  metaTitle: string;
  metaDescription: string;
}

function parseBase64Image(dataUrl: string): { mediaType: string; base64Data: string } {
  // matches data:image/png;base64,iVBOR...
  const matches = dataUrl.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-+.]+);base64,(.*)$/);
  if (!matches || matches.length < 3) {
    throw new Error("Invalid base64 data URL");
  }
  return {
    mediaType: matches[1],
    base64Data: matches[2],
  };
}

export async function generateProductDetails(
  name?: string,
  sku?: string,
  brandName?: string,
  images?: string[] // array of base64 data URLs
): Promise<ProductAiResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey || apiKey === "sk-ant-") {
    console.log("[CLAUDE AI MOCK] Generating mock response for:", name || sku);
    return getMockDetails(name, sku, brandName);
  }

  const prompt = `Sen O'zbekistondagi "Best Tools" nomli premium elektr asboblar do'koni uchun mahsulot to'ldiruvchi AI yordamchisisan.
  
Menga quyidagi mahsulot ma'lumotlari berildi:
${name ? `- Nomi: ${name}` : ""}
${sku ? `- SKU: ${sku}` : ""}
${brandName ? `- Brend: ${brandName}` : ""}

${images && images.length > 0 ? "Shuningdek, men senga ushbu mahsulotning rasmini yubordim. Uni diqqat bilan o'rganib chiq." : ""}

Iltimos, ushbu ma'lumotlar va rasm asosida original, texnik to'g'ri va sotuvchan kontent tayyorlab ber.
Javob faqat va faqat quyidagi formatdagi JSON ob'ekti bo'lishi shart (boshqa hech qanday izoh yoki matn qo'shma):

{
  "name": "O'zbek tilidagi to'liq brend nomi bilan mos nom (masalan: Bosch GSB 18V-50 Professional)",
  "nameRu": "Rus tilidagi to'liq nom (masalan: Ударная дрель-шуруповерт Bosch GSB 18V-50)",
  "shortDesc": "O'zbek tilida 1 qatorlik qisqa tavsif",
  "description": "O'zbek tilida to'liq va mukammal tavsif (3-4 ta paragrafdan iborat bo'lsin)",
  "descriptionRu": "Rus tilida to'liq va mukammal tavsif (3-4 ta paragraf)",
  "specs": {
    "voltage": "akkumulyator kuchlanishi, masalan 18V (agar akkumulyatorli bo'lsa)",
    "power": "tarmoq quvvati, masalan 800W (agar simli bo'lsa)",
    "weight": "og'irligi, masalan 1.8 kg",
    "speed": "aylanishlar soni, masalan 0-1800 rpm",
    "torque": "maksimal aylanuvchi moment, masalan 50 Nm",
    "drillCapacity": "maksimal burg'ulash diametri, masalan 13 mm"
  },
  "metaTitle": "SEO meta sarlavhasi, maks 60 belgi",
  "metaDescription": "SEO meta tavsifi, maks 160 belgi"
}`;

  try {
    const contentPayload: any[] = [];

    // Append images if present in base64
    if (images && images.length > 0) {
      for (const img of images) {
        try {
          const { mediaType, base64Data } = parseBase64Image(img);
          contentPayload.push({
            type: "image",
            source: {
              type: "base64",
              media_type: mediaType,
              data: base64Data,
            },
          });
        } catch (e) {
          console.warn("Failed to parse image for Claude API, skipping:", e);
        }
      }
    }

    // Append main text prompt
    contentPayload.push({
      type: "text",
      text: prompt,
    });

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022", // Using Claude 3.5 Sonnet
        max_tokens: 1500,
        messages: [{ role: "user", content: contentPayload }],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Claude API failed with status ${res.status}: ${errText}`);
    }

    const responseData = await res.json();
    const responseText = responseData.content[0].text;

    // Extract JSON block
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Claude returned invalid JSON format");

    return JSON.parse(jsonMatch[0]) as ProductAiResponse;
  } catch (error) {
    console.error("Claude API query failed, falling back to mock:", error);
    return getMockDetails(name, sku, brandName);
  }
}

function getMockDetails(name?: string, sku?: string, brandName?: string): ProductAiResponse {
  const finalName = name || `${brandName || "Premium"} ${sku || "Tool"}`;
  return {
    name: `${finalName} Professional`,
    nameRu: `${finalName} Professional`,
    shortDesc: `${finalName} — yuqori unumdorlik va chidamlilikka ega professional asbob.`,
    description: `Ushbu ${finalName} professional darajadagi qurilish, ta'mirlash va montaj ishlarida foydalanish uchun maxsus ishlab chiqilgan. Kuchli dvigatel og'ir yuklamalarda ham barqaror ishlashni kafolatlaydi.\n\nErgonomik korpus va yumshoq tutqichlar foydalanish vaqtida toliqishni kamaytiradi va maksimal nazoratni ta'minlaydi. Kompakt o'lchamlari tufayli tor joylarda ham ishlash juda qulay.\n\nIlg'or elektronika tizimi asbobni ortiqcha qizib ketishdan va yuklanishdan himoya qilib, xizmat muddatini bir necha barobarga uzaytiradi.`,
    descriptionRu: `Этот ${finalName} специально разработан для профессиональных строительных, ремонтных и монтажных работ. Мощный двигатель гарантирует стабильную работу даже при высоких нагрузках.\n\nЭргономичный корпус и мягкие рукоятки снижают утомляемость при работе и обеспечивают максимальный контроль. Благодаря компактным размерам удобно работать даже в труднодоступных местах.`,
    specs: {
      voltage: "18V",
      power: "850W",
      weight: "1.9 kg",
      speed: "0-1900 rpm",
      torque: "55 Nm",
      drillCapacity: "13 mm",
    },
    metaTitle: `${finalName} Professional sotib olish | Best Tools`,
    metaDescription: `${finalName} professional elektr asbobini Best Tools do'konidan qulay narxda sotib oling. O'zbekiston bo'ylab yetkazib berish va kafolat bor.`,
  };
}
