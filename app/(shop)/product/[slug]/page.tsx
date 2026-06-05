import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { Star, ChevronRight } from "lucide-react";
import { mockProducts, mockCategories, formatPrice, calculateDiscount } from "@/lib/mock-data";
import { prisma } from "@/lib/prisma";
import { translations } from "@/lib/translations";
import ProductCard from "@/components/shop/ProductCard";
import ProductActions from "@/components/shop/ProductActions";

const specLabels: Record<string, { uz: string; ru: string }> = {
  // English keys
  voltage: { uz: "akkumulyator kuchlanishi", ru: "напряжение аккумулятора" },
  power: { uz: "quvvati", ru: "мощность" },
  weight: { uz: "og'irligi", ru: "вес" },
  speed: { uz: "aylanishlar soni", ru: "число оборотов" },
  torque: { uz: "maksimal aylanuvchi moment", ru: "крутящий момент" },
  drillcapacity: { uz: "burg'ulash diametri", ru: "диаметр сверления" },
  drillCapacity: { uz: "burg'ulash diametri", ru: "диаметр сверления" },
  disk: { uz: "disk diametri", ru: "диаметр диска" },
  energy: { uz: "zarba quvvati", ru: "энергия удара" },
  clutch: { uz: "patron", ru: "патрон" },
  blade: { uz: "arra diski", ru: "пильный диск" },
  depth: { uz: "kesish chuqurligi", ru: "глубина пропила" },

  // Russian keys
  "напряжение аккумулятора": { uz: "akkumulyator kuchlanishi", ru: "напряжение аккумулятора" },
  "мощность": { uz: "quvvati", ru: "мощность" },
  "мощность ": { uz: "quvvati", ru: "мощность" },
  "вес": { uz: "og'irligi", ru: "вес" },
  "число оборотов": { uz: "aylanishlar soni", ru: "число оборотов" },
  "крутящий момент": { uz: "maksimal aylanuvchi moment", ru: "крутящий момент" },
  "диаметр сверления": { uz: "burg'ulash diametri", ru: "диаметр сверления" },
  "диаметр диска": { uz: "disk diametri", ru: "диаметр диска" },
  "энергия удара": { uz: "zarba quvvati", ru: "энергия удара" },
  "патрон": { uz: "patron", ru: "патрон" },
  "пильный диск": { uz: "arra diski", ru: "пильный диск" },
  "глубина пропила": { uz: "kesish chuqurligi", ru: "глубина пропила" },
};

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let product = null;
  try {
    product = await prisma.product.findUnique({
      where: { slug },
      include: { brand: true, category: true },
    });
  } catch {}
  
  if (!product) {
    product = mockProducts.find((p) => p.slug === slug);
  }
  
  if (!product) return { title: "Mahsulot topilmadi" };
  const cookieStore = await cookies();
  const lang = cookieStore.get("language")?.value === "ru" ? "ru" : "uz";
  const name = lang === "ru" && product.nameRu ? product.nameRu : product.name;
  return {
    title: `${name} | Best Tools`,
    description:
      product.shortDesc ||
      `${name} — ${product.brand.name}. Best Tools'da sotib oling.`,
  };
}

export async function generateStaticParams() {
  return mockProducts.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  let product = null;
  try {
    product = await prisma.product.findUnique({
      where: { slug },
      include: { brand: true, category: true },
    });
  } catch {}

  if (!product) {
    product = mockProducts.find((p) => p.slug === slug);
  }
  
  if (!product) notFound();

  const cookieStore = await cookies();
  const lang = cookieStore.get("language")?.value === "ru" ? "ru" : "uz";
  const dict = translations[lang];

  const categoryObj = mockCategories.find((c) => c.slug === product.category.slug);
  const categoryName = lang === "ru" && categoryObj?.nameRu ? categoryObj.nameRu : product.category.name;
  const productName = lang === "ru" && product.nameRu ? product.nameRu : product.name;

  const discount = product.oldPrice
    ? calculateDiscount(Number(product.price), Number(product.oldPrice))
    : null;

  const similar = mockProducts
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.brand.slug === product.brand.slug ||
          p.category.slug === product.category.slug)
    )
    .slice(0, 4);

  return (
    <div
      className="container-main"
      style={{ paddingTop: "32px", paddingBottom: "60px" }}
    >
      {/* Breadcrumb */}
      <div
        style={{
          display: "flex",
          gap: "6px",
          alignItems: "center",
          fontSize: "13px",
          color: "#6b6b6b",
          marginBottom: "32px",
          flexWrap: "wrap",
        }}
      >
        <a href="/" style={{ color: "#6b6b6b" }}>
          {dict.home}
        </a>
        <ChevronRight size={12} />
        <a href="/catalog" style={{ color: "#6b6b6b" }}>
          {dict.catalog}
        </a>
        <ChevronRight size={12} />
        <a
          href={`/catalog?category=${product.category.slug}`}
          style={{ color: "#6b6b6b" }}
        >
          {categoryName}
        </a>
        <ChevronRight size={12} />
        <span style={{ color: "#a3a3a3" }}>{productName}</span>
      </div>

      {/* Main product section */}
      <div
        className="product-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "40px",
          marginBottom: "60px",
        }}
      >
        {/* Left: Images */}
        <div>
          {/* Main image */}
          <div
            style={{
              background: "linear-gradient(135deg, #141414 0%, #1c1c1c 100%)",
              border: "1px solid #1a1a1a",
              borderRadius: "16px",
              aspectRatio: "1 / 1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "16px",
                left: "16px",
                background: "rgba(0,0,0,0.7)",
                backdropFilter: "blur(8px)",
                borderRadius: "8px",
                padding: "4px 12px",
                fontSize: "12px",
                fontWeight: 800,
                color: "#f5f5f5",
                letterSpacing: "0.05em",
              }}
            >
              {product.brand.name.toUpperCase()}
            </div>

            {discount && (
              <div
                style={{ position: "absolute", top: "16px", right: "16px" }}
              >
                <span
                  className="badge-sale"
                  style={{ fontSize: "14px", padding: "4px 12px" }}
                >
                  -{discount}%
                </span>
              </div>
            )}

            {product.images && product.images.length > 0 && product.images[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.images[0]}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  padding: "24px",
                  position: "relative",
                  zIndex: 1,
                }}
              />
            ) : (
              <div style={{ fontSize: "120px", opacity: 0.2 }}>🔧</div>
            )}

            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(circle at center, rgba(250,204,21,0.04) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 0 && (
            <div style={{ display: "flex", gap: "8px" }}>
              {product.images.map((img, i) => (
                <div
                  key={i}
                  style={{
                    width: "80px",
                    height: "80px",
                    background: "#111111",
                    border: i === 0 ? "2px solid #facc15" : "1px solid #1a1a1a",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    overflow: "hidden",
                    padding: "6px",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={`${product.name} thumbnail ${i + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Brand + Category */}
          <div style={{ display: "flex", gap: "8px" }}>
            <span
              style={{
                background: "rgba(250,204,21,0.1)",
                border: "1px solid rgba(250,204,21,0.2)",
                color: "#facc15",
                fontSize: "12px",
                fontWeight: 600,
                padding: "3px 10px",
                borderRadius: "100px",
              }}
            >
              {product.brand.name}
            </span>
            <span
              style={{
                background: "#111111",
                border: "1px solid #2a2a2a",
                color: "#6b6b6b",
                fontSize: "12px",
                padding: "3px 10px",
                borderRadius: "100px",
              }}
            >
              {categoryName}
            </span>
          </div>

          {/* Name */}
          <h1
            style={{
              fontSize: "clamp(20px, 2.5vw, 26px)",
              fontWeight: 800,
              lineHeight: 1.25,
              color: "#f5f5f5",
            }}
          >
            {productName}
          </h1>

          {/* SKU + Rating */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontSize: "12px", color: "#4a4a4a" }}>
              SKU:{" "}
              <span style={{ color: "#6b6b6b" }}>{product.sku}</span>
            </span>
            <div
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              <div style={{ display: "flex", gap: "2px" }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={14}
                    fill={
                      s <= Math.round(product.rating) ? "#facc15" : "none"
                    }
                    color={
                      s <= Math.round(product.rating) ? "#facc15" : "#3a3a3a"
                    }
                  />
                ))}
              </div>
              <span style={{ fontSize: "13px", color: "#a3a3a3" }}>
                {product.rating.toFixed(1)} / 5.0
              </span>
            </div>
          </div>

          {/* Interactive actions (client component) */}
          <ProductActions
            id={product.id}
            sku={product.sku}
            slug={product.slug}
            image={product.images[0] || ""}
            price={Number(product.price)}
            oldPrice={product.oldPrice ? Number(product.oldPrice) : undefined}
            installmentAvailable={product.installmentAvailable}
            stock={product.stock}
            name={productName}
          />

          {/* Description */}
          <p
            style={{
              color: "#a3a3a3",
              fontSize: "15px",
              lineHeight: 1.6,
              whiteSpace: "pre-line",
            }}
          >
            {lang === "ru" && (product as any).descriptionRu
              ? (product as any).descriptionRu
              : ((product as any).description || product.shortDesc)}
          </p>

        </div>
      </div>

      {/* Specs table */}
      {product.specs && Object.keys(product.specs).length > 0 && (
        <div style={{ marginBottom: "60px" }}>
          <h2
            className="section-title"
            style={{ marginBottom: "24px", fontSize: "22px" }}
          >
            {dict.specs}
          </h2>
          <div
            style={{
              background: "#111111",
              border: "1px solid #1a1a1a",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            {Object.entries(product.specs)
              .filter(([, v]) => v != null)
              .map(([key, value], index, arr) => (
                <div
                  key={key}
                  style={{
                    display: "flex",
                    padding: "14px 20px",
                    borderBottom:
                      index < arr.length - 1
                        ? "1px solid #1a1a1a"
                        : "none",
                    background:
                      index % 2 === 0
                        ? "transparent"
                        : "rgba(255,255,255,0.01)",
                  }}
                >
                  <span
                    style={{
                      width: "200px",
                      fontSize: "14px",
                      color: "#6b6b6b",
                      textTransform: "capitalize",
                      flexShrink: 0,
                    }}
                  >
                    {specLabels[key.trim().toLowerCase()]?.[lang] || specLabels[key]?.[lang] || key}
                  </span>
                  <span
                    style={{
                      fontSize: "14px",
                      color: "#f5f5f5",
                      fontWeight: 500,
                    }}
                  >
                    {value}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Similar products */}
      {similar.length > 0 && (
        <div>
          <h2
            className="section-title"
            style={{ marginBottom: "24px", fontSize: "22px" }}
          >
            {dict.similarProducts}
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "16px",
            }}
          >
            {similar.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .product-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
