"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { mockProducts } from "@/lib/mock-data";
import ProductCard from "./ProductCard";

export default function FeaturedProducts() {
  const featured = mockProducts.filter((p) => p.isFeatured);

  return (
    <section style={{ padding: "60px 0", background: "#0a0a0a" }}>
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
                display: "block",
                marginBottom: "8px",
              }}
            >
              Eng yaxshi tanlov
            </span>
            <h2 className="section-title">Tanlangan Mahsulotlar</h2>
          </div>
          <Link
            href="/catalog?featured=true"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: "#facc15",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            Hammasi
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Products grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "16px",
          }}
        >
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
