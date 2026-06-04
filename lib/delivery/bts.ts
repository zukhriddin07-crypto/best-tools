export interface BtsOrderParams {
  orderNumber: string;
  senderName: string;
  senderPhone: string;
  receiverName: string;
  receiverPhone: string;
  receiverRegion: string;
  receiverCity: string;
  receiverStreet: string;
  weight: number; // in kg
}

export async function calculateBtsDelivery(
  weight: number,
  regionName: string
): Promise<{ success: boolean; cost: number; error?: string }> {
  const apiKey = process.env.BTS_API_KEY;

  // Real BTS API endpoint for price calculation (simulated/mocked when token is absent)
  if (!apiKey) {
    console.log(`[BTS LOGISTICS MOCK] Calculating shipping cost for region: ${regionName}, weight: ${weight}kg`);
    
    // Simple regional calculation logic
    let cost = 25000; // base price
    if (regionName.toLowerCase() !== "toshkent sh." && regionName.toLowerCase() !== "toshkent") {
      cost = 35000 + Math.ceil(weight) * 2000; // viloyatlarga og'irlik bo'yicha qo'shimcha haq
    }
    return { success: true, cost };
  }

  try {
    const res = await fetch("https://api.bts.uz/v1/delivery/calculate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ weight, region: regionName }),
    });

    if (!res.ok) {
      throw new Error(`BTS API returned status ${res.status}`);
    }

    const data = await res.json();
    return { success: true, cost: data.price };
  } catch (error: any) {
    console.error("BTS delivery calculation failed:", error);
    return { success: false, cost: 35000, error: error.message }; // fallback default cost
  }
}

export async function createBtsOrder(
  params: BtsOrderParams
): Promise<{ success: boolean; trackingNumber?: string; error?: string }> {
  const apiKey = process.env.BTS_API_KEY;

  if (!apiKey) {
    const mockTrackingNumber = `BTS-${Math.floor(10000000 + Math.random() * 90000000)}`;
    console.log(`[BTS LOGISTICS MOCK] Order parcel registered for: ${params.receiverName}, Phone: ${params.receiverPhone}. Tracking Number: ${mockTrackingNumber}`);
    return { success: true, trackingNumber: mockTrackingNumber };
  }

  try {
    const res = await fetch("https://api.bts.uz/v1/parcels/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        cargo_number: params.orderNumber,
        receiver_name: params.receiverName,
        receiver_phone: params.receiverPhone,
        address: `${params.receiverRegion}, ${params.receiverCity}, ${params.receiverStreet}`,
        weight: params.weight,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`BTS API failed: ${res.status} - ${errText}`);
    }

    const data = await res.json();
    return { success: true, trackingNumber: data.tracking_number };
  } catch (error: any) {
    console.error("BTS order creation failed:", error);
    return { success: false, error: error.message };
  }
}
