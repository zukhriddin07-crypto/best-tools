"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { mockProducts } from "@/lib/mock-data";

import ProductCard from "./ProductCard";

export default function SaleSection() {
  // Products with oldPrice (discounted)
  const saleProducts = mockProducts.filter((p) => p.oldPrice != null);

  return (
    <section
      style={{
        padding: "60px 0",
        background: "linear-gradient(180deg, #090909 0%, #0d0b00 50%, #090909 100%)",
        borderTop: "1px solid rgba(250,204,21,0.08)",
        borderBottom: "1px solid rgba(250,204,21,0.08)",
      }}
    >
      <div className="container-main">
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "36px",
          }}
        >
          <div>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "#facc15",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginBottom: "8px",
              }}
            >
              <Zap size={12} />
              Chegirma
            </span>
            <h2 className="section-title">
              Aksiya
              <span
                style={{
                  marginLeft: "16px",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#6b6b6b",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {saleProducts.length} ta mahsulot
              </span>
            </h2>
          </div>
          <Link
            href="/catalog?sale=true"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(250,204,21,0.1)",
              border: "1px solid rgba(250,204,21,0.3)",
              color: "#facc15",
              fontSize: "13px",
              fontWeight: 700,
              padding: "8px 16px",
              borderRadius: "8px",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "rgba(250,204,21,0.15)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "rgba(250,204,21,0.1)";
            }}
          >
            Barcha aksiyalar
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Sale products */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "16px",
          }}
        >
          {saleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
