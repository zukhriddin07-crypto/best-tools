export interface YandexClaimParams {
  orderNumber: string;
  receiverName: string;
  receiverPhone: string;
  addressTo: string;
  items: Array<{ name: string; quantity: number }>;
}

export async function calculateYandexDelivery(
  addressTo: string
): Promise<{ success: boolean; cost: number; error?: string }> {
  const token = process.env.YANDEX_DELIVERY_TOKEN;

  if (!token) {
    console.log(`[YANDEX LOGISTICS MOCK] Calculating shipping cost to: ${addressTo}`);
    // Toshkent sh. ichida standard express mock narxi
    return { success: true, cost: 25000 };
  }

  try {
    const res = await fetch("https://b2b.taxi.yandex.net/api/b2b/platform/offers/calculate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        source: { address: "Toshkent, Kichik xalka yo'li ko'chasi 10" },
        destination: { address: addressTo },
      }),
    });

    if (!res.ok) {
      throw new Error(`Yandex API returned status ${res.status}`);
    }

    const data = await res.json();
    return { success: true, cost: data.price };
  } catch (error: any) {
    console.error("Yandex delivery calculation failed:", error);
    return { success: false, cost: 25000, error: error.message };
  }
}

export async function createYandexDeliveryClaim(
  params: YandexClaimParams
): Promise<{ success: boolean; claimId?: string; error?: string }> {
  const token = process.env.YANDEX_DELIVERY_TOKEN;

  if (!token) {
    const mockClaimId = `YNDX-CLAIM-${Math.floor(10000000 + Math.random() * 90000000)}`;
    console.log(`[YANDEX LOGISTICS MOCK] Delivery request registered for: ${params.receiverName}. Claim ID: ${mockClaimId}`);
    return { success: true, claimId: mockClaimId };
  }

  try {
    const res = await fetch("https://b2b.taxi.yandex.net/api/b2b/platform/claims/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        shipping_id: params.orderNumber,
        route_points: [
          { id: 1, address: "Toshkent, Kichik xalka yo'li ko'chasi 10", type: "source" },
          { id: 2, address: params.addressTo, type: "destination" },
        ],
        receiver: {
          name: params.receiverName,
          phone: params.receiverPhone,
        },
        items: params.items.map((item) => ({
          extra_id: item.name,
          title: item.name,
          quantity: item.quantity,
        })),
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Yandex API failed: ${res.status} - ${errText}`);
    }

    const data = await res.json();
    return { success: true, claimId: data.id };
  } catch (error: any) {
    console.error("Yandex order creation failed:", error);
    return { success: false, error: error.message };
  }
}
