import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        brand: true,
        category: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Mahsulot topilmadi" }, { status: 404 });
    }

    return NextResponse.json({
      ...product,
      price: Number(product.price),
      oldPrice: product.oldPrice ? Number(product.oldPrice) : null,
    });
  } catch (error: any) {
    console.error("GET /api/products/[id] error:", error);
    return NextResponse.json({ error: "Tizim xatosi" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const body = await request.json();

    const {
      name,
      nameRu,
      sku,
      slug,
      brandId,
      categoryId,
      price,
      oldPrice,
      stock,
      shortDesc,
      description,
      descriptionRu,
      metaTitle,
      metaDescription,
      isActive,
      isFeatured,
      installmentAvailable,
      specs,
      images,
    } = body;

    // Validate required fields
    if (!name || !sku || !brandId || !categoryId || !price || stock === undefined) {
      return NextResponse.json(
        { error: "Majburiy maydonlar kiritilmagan" },
        { status: 400 }
      );
    }

    // Convert specs array [ {key, value} ] to object { key: value } if array passed
    let specsObj: Record<string, string> = {};
    if (Array.isArray(specs)) {
      specs.forEach((item: any) => {
        if (item.key && item.value) {
          specsObj[item.key] = item.value;
        }
      });
    } else if (specs && typeof specs === "object") {
      specsObj = specs;
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        nameRu: nameRu || null,
        sku,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        brandId,
        categoryId,
        price: parseFloat(price),
        oldPrice: oldPrice ? parseFloat(oldPrice) : null,
        stock: parseInt(stock),
        shortDesc: shortDesc || null,
        description: description || shortDesc || name,
        descriptionRu: descriptionRu || null,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        isActive: isActive !== false,
        isFeatured: isFeatured || false,
        installmentAvailable: installmentAvailable !== false,
        specs: specsObj as any,
        images: Array.isArray(images) ? images : [],
      },
    });

    return NextResponse.json({
      success: true,
      product: {
        ...updatedProduct,
        price: Number(updatedProduct.price),
        oldPrice: updatedProduct.oldPrice ? Number(updatedProduct.oldPrice) : null,
      },
    });
  } catch (error: any) {
    console.error("PUT /api/products/[id] error:", error);
    return NextResponse.json(
      { error: error.message || "Tahrirlashda xatolik yuz berdi" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Mahsulot o'chirildi" });
  } catch (error: any) {
    console.error("DELETE /api/products/[id] error:", error);
    return NextResponse.json(
      { error: error.message || "O'chirishda xatolik yuz berdi" },
      { status: 500 }
    );
  }
}
