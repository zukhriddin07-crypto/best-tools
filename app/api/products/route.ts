import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mockProducts, mockBrands, mockCategories } from "@/lib/mock-data";

// Helper to seed database if empty
async function seedDatabaseIfEmpty() {
  try {
    const productCount = await prisma.product.count();
    if (productCount > 0) return;

    console.log("Database is empty. Seeding brands, categories, and products...");

    // 1. Seed Brands
    for (const brand of mockBrands) {
      await prisma.brand.upsert({
        where: { id: brand.id },
        update: {},
        create: {
          id: brand.id,
          name: brand.name,
          slug: brand.slug,
          logo: brand.logo,
          description: brand.description,
        },
      });
    }

    // 2. Seed Categories
    for (const cat of mockCategories) {
      await prisma.category.upsert({
        where: { id: cat.id },
        update: {},
        create: {
          id: cat.id,
          name: cat.name,
          nameRu: cat.nameRu,
          slug: cat.slug,
          image: cat.image,
        },
      });
    }

    // 3. Seed Products
    for (const prod of mockProducts) {
      // Find Brand ID
      const brand = await prisma.brand.findUnique({
        where: { slug: prod.brand.slug },
      });
      // Find Category ID
      const category = await prisma.category.findUnique({
        where: { slug: prod.category.slug },
      });

      if (!brand || !category) continue;

      await prisma.product.upsert({
        where: { id: prod.id },
        update: {},
        create: {
          id: prod.id,
          name: prod.name,
          nameRu: prod.nameRu,
          slug: prod.slug,
          sku: prod.sku,
          shortDesc: prod.shortDesc,
          description: prod.shortDesc || prod.name,
          price: prod.price,
          oldPrice: prod.oldPrice,
          stock: prod.stock,
          brandId: brand.id,
          categoryId: category.id,
          images: prod.images,
          rating: prod.rating,
          isFeatured: prod.isFeatured,
          installmentAvailable: prod.installmentAvailable,
          specs: prod.specs as any,
        },
      });
    }

    console.log("Seeding completed successfully.");
  } catch (error) {
    console.error("Database seeding failed:", error);
  }
}

export async function GET() {
  try {
    await seedDatabaseIfEmpty();

    const products = await prisma.product.findMany({
      include: {
        brand: true,
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const mappedProducts = products.map((p) => ({
      ...p,
      price: Number(p.price),
      oldPrice: p.oldPrice ? Number(p.oldPrice) : null,
    }));

    return NextResponse.json(mappedProducts);
  } catch (error: any) {
    console.error("GET /api/products error:", error);
    // If DB fails, fallback to mockProducts
    return NextResponse.json(mockProducts);
  }
}

export async function POST(request: NextRequest) {
  try {
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

    const newProduct = await prisma.product.create({
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
        ...newProduct,
        price: Number(newProduct.price),
        oldPrice: newProduct.oldPrice ? Number(newProduct.oldPrice) : null,
      },
    });
  } catch (error: any) {
    console.error("POST /api/products error:", error);
    return NextResponse.json(
      { error: error.message || "Mahsulot qo'shishda xatolik yuz berdi" },
      { status: 500 }
    );
  }
}
