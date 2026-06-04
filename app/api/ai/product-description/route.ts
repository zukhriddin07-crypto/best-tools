import { NextRequest, NextResponse } from "next/server";
import { generateProductDetails } from "@/lib/ai";
import { mockBrands } from "@/lib/mock-data";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { name, sku, brandId, images } = await request.json();

    // Resolve brand name from DB if possible, otherwise use mock
    let brandName = "";
    if (brandId) {
      try {
        const brand = await prisma.brand.findUnique({
          where: { id: brandId },
        });
        if (brand) {
          brandName = brand.name;
        }
      } catch (err) {
        // Fallback to mock brands
        const mockBrand = mockBrands.find((b) => b.id === brandId);
        if (mockBrand) {
          brandName = mockBrand.name;
        }
      }
    }

    const result = await generateProductDetails(name, sku, brandName, images);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("AI product description error:", error);
    return NextResponse.json(
      { error: error.message || "AI xizmati hozir mavjud emas" },
      { status: 500 }
    );
  }
}

