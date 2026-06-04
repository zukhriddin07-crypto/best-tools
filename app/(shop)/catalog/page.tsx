import React from "react";
import type { Metadata } from "next";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import { mockProducts, mockBrands, mockCategories } from "@/lib/mock-data";
import ProductCard from "@/components/shop/ProductCard";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Katalog — Barcha Mahsulotlar",
  description:
    "Professional elektr asboblar katalogi. Drellar, perforatorlar, arra mashinalar, silliqlash mashinalari. Bosch, Milwaukee, DeWalt, Makita.",
};

export default async function CatalogPage() {
  let products: any[] = [];
  try {
    products = await prisma.product.findMany({
      include: {
        brand: true,
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    if (products.length === 0) {
      products = mockProducts as any[];
    }
  } catch (err) {
    console.error("Prisma products fetch failed, falling back to mockProducts:", err);
    products = mockProducts as any[];
  }

  return (
    <div className="container-main" style={{ paddingTop: "32px", paddingBottom: "60px" }}>
      {/* Breadcrumb */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          fontSize: "13px",
          color: "#6b6b6b",
          marginBottom: "24px",
        }}
      >
        <a href="/" style={{ color: "#6b6b6b" }}>Bosh sahifa</a>
        <span>/</span>
        <span style={{ color: "#f5f5f5" }}>Katalog</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "24px" }}>
        {/* Sidebar filters */}
        <aside
          style={{
            display: "none", // Hidden on mobile, shown on desktop via media query
          }}
          className="catalog-sidebar"
        >
          {/* Filter section */}
          <div
            style={{
              background: "#111111",
              border: "1px solid #1a1a1a",
              borderRadius: "12px",
              padding: "20px",
              position: "sticky",
              top: "80px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "20px",
                paddingBottom: "16px",
                borderBottom: "1px solid #1a1a1a",
              }}
            >
              <SlidersHorizontal size={16} style={{ color: "#facc15" }} />
              <span style={{ fontWeight: 700, fontSize: "14px" }}>Filtrlar</span>
            </div>

            {/* Brand filter */}
            <div style={{ marginBottom: "24px" }}>
              <h3
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#6b6b6b",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: "12px",
                }}
              >
                Brend
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {mockBrands.map((brand) => (
                  <label
                    key={brand.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      style={{
                        accentColor: "#facc15",
                        width: "16px",
                        height: "16px",
                      }}
                    />
                    <span style={{ fontSize: "14px", color: "#a3a3a3" }}>
                      {brand.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Category filter */}
            <div style={{ marginBottom: "24px" }}>
              <h3
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#6b6b6b",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: "12px",
                }}
              >
                Kategoriya
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {mockCategories.map((cat) => (
                  <label
                    key={cat.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      style={{
                        accentColor: "#facc15",
                        width: "16px",
                        height: "16px",
                      }}
                    />
                    <span style={{ fontSize: "14px", color: "#a3a3a3" }}>
                      {cat.name}
                    </span>
                    <span style={{ marginLeft: "auto", fontSize: "12px", color: "#4a4a4a" }}>
                      {cat.count}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price range */}
            <div style={{ marginBottom: "24px" }}>
              <h3
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#6b6b6b",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: "12px",
                }}
              >
                Narx (so&#39;m)
              </h3>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="number"
                  placeholder="Dan"
                  style={{
                    flex: 1,
                    background: "#1a1a1a",
                    border: "1px solid #2a2a2a",
                    borderRadius: "6px",
                    padding: "8px 10px",
                    color: "#f5f5f5",
                    fontSize: "13px",
                    outline: "none",
                    width: "100%",
                  }}
                />
                <input
                  type="number"
                  placeholder="Gacha"
                  style={{
                    flex: 1,
                    background: "#1a1a1a",
                    border: "1px solid #2a2a2a",
                    borderRadius: "6px",
                    padding: "8px 10px",
                    color: "#f5f5f5",
                    fontSize: "13px",
                    outline: "none",
                    width: "100%",
                  }}
                />
              </div>
            </div>

            {/* Apply button */}
            <button
              style={{
                width: "100%",
                background: "#facc15",
                color: "#0a0a0a",
                fontWeight: 700,
                padding: "10px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Filtrlash
            </button>
          </div>
        </aside>

        {/* Main content */}
        <div>
          {/* Top bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <h1 style={{ fontSize: "22px", fontWeight: 800 }}>
              Barcha mahsulotlar
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#6b6b6b",
                  marginLeft: "10px",
                }}
              >
                ({products.length} ta)
              </span>
            </h1>

            {/* Sort */}
            <div style={{ position: "relative" }}>
              <select
                style={{
                  appearance: "none",
                  background: "#111111",
                  border: "1px solid #2a2a2a",
                  borderRadius: "8px",
                  padding: "8px 32px 8px 14px",
                  color: "#f5f5f5",
                  fontSize: "13px",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                <option value="popular">Ommabopligi</option>
                <option value="price_asc">Narx: arzon</option>
                <option value="price_desc">Narx: qimmat</option>
                <option value="newest">Yangilar</option>
                <option value="rating">Reyting</option>
              </select>
              <ChevronDown
                size={14}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#6b6b6b",
                  pointerEvents: "none",
                }}
              />
            </div>
          </div>

          {/* Products grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "16px",
            }}
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .catalog-sidebar { display: block !important; }
        }
      `}</style>
    </div>
  );
}
