"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { mockCategories } from "@/lib/mock-data";
import { useLanguage } from "@/lib/language-context";

// Icon components for each category
function CategoryIcon({ type }: { type: string }) {
  const icons: Record<string, string> = {
    drill: "⚙️",
    hammer: "🔨",
    saw: "🪚",
    grinder: "✨",
    screwdriver: "🔧",
    welding: "⚡",
  };
  return (
    <span style={{ fontSize: "32px", lineHeight: 1 }}>
      {icons[type] || "🔩"}
    </span>
  );
}

const categoryGradients = [
  "linear-gradient(135deg, #1a0a00 0%, #2a1200 100%)",
  "linear-gradient(135deg, #0a1a00 0%, #122a00 100%)",
  "linear-gradient(135deg, #00081a 0%, #00122a 100%)",
  "linear-gradient(135deg, #1a001a 0%, #2a002a 100%)",
  "linear-gradient(135deg, #1a0800 0%, #2a1200 100%)",
  "linear-gradient(135deg, #001a1a 0%, #002a2a 100%)",
];

export default function CategoriesSection() {
  const { language, t } = useLanguage();
  return (
    <section style={{ padding: "60px 0", background: "#090909" }}>
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
              {t("easyToChoose")}
            </span>
            <h2 className="section-title">{t("categories")}</h2>
          </div>
          <Link
            href="/catalog"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: "#facc15",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            {t("viewAll")}
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Categories grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: "12px",
          }}
        >
          {mockCategories.map((cat, index) => (
            <Link
              key={cat.id}
              href={`/catalog?category=${cat.slug}`}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                padding: "28px 16px",
                background: categoryGradients[index % categoryGradients.length],
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: "14px",
                textDecoration: "none",
                transition: "all 0.25s",
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "rgba(250,204,21,0.25)";
                el.style.transform = "translateY(-4px) scale(1.02)";
                el.style.boxShadow = "0 12px 40px rgba(0,0,0,0.5)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "rgba(255,255,255,0.05)";
                el.style.transform = "translateY(0) scale(1)";
                el.style.boxShadow = "none";
              }}
            >
              {/* Accent glow */}
              <div
                style={{
                  position: "absolute",
                  top: "-20px",
                  right: "-20px",
                  width: "80px",
                  height: "80px",
                  background: "radial-gradient(circle, rgba(250,204,21,0.06) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />

              {/* Icon */}
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid rgba(250,204,21,0.1)",
                }}
              >
                <CategoryIcon type={cat.icon} />
              </div>

              {/* Text */}
              <div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "#f5f5f5",
                    marginBottom: "4px",
                    lineHeight: 1.3,
                  }}
                >
                  {language === "ru" && cat.nameRu ? cat.nameRu : cat.name}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#6b6b6b",
                  }}
                >
                  {cat.count} {language === "ru" ? "товаров" : "mahsulot"}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
