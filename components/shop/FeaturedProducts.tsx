"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import ProductCard from "./ProductCard";

export default function FeaturedProducts() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const featured = products.filter((p) => p.isFeatured);

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
              {t("bestChoice")}
            </span>
            <h2 className="section-title">{t("featuredProducts")}</h2>
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
            {t("all")}
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
