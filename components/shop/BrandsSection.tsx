"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { mockBrands } from "@/lib/mock-data";

// Brand color map for visual identity
const brandColors: Record<string, { bg: string; text: string; accent: string }> = {
  bosch: { bg: "#001f5b", text: "#ffffff", accent: "#007dc5" },
  milwaukee: { bg: "#c8102e", text: "#ffffff", accent: "#ff0000" },
  dewalt: { bg: "#febd17", text: "#000000", accent: "#f0a500" },
  makita: { bg: "#00539c", text: "#ffffff", accent: "#007dc5" },
  hilti: { bg: "#cf0a2c", text: "#ffffff", accent: "#ff3333" },
  metabo: { bg: "#003087", text: "#ffffff", accent: "#0055cc" },
};

// Brand abbreviation logos (until real logos are uploaded)
function BrandLogo({ name, slug }: { name: string; slug: string }) {
  const colors = brandColors[slug] || { bg: "#1a1a1a", text: "#f5f5f5", accent: "#facc15" };
  return (
    <div
      style={{
        width: "64px",
        height: "64px",
        background: colors.bg,
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "11px",
        fontWeight: 900,
        color: colors.text,
        letterSpacing: "0.05em",
        border: `2px solid ${colors.accent}22`,
        flexShrink: 0,
      }}
    >
      {name.substring(0, 3).toUpperCase()}
    </div>
  );
}

export default function BrandsSection() {
  return (
    <section style={{ padding: "60px 0", borderBottom: "1px solid #1a1a1a" }}>
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
              Ishonchli hamkorlar
            </span>
            <h2 className="section-title">Premium Brendlar</h2>
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
              transition: "gap 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.gap = "10px";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.gap = "6px";
            }}
          >
            Barchasini ko&#39;rish
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Brands grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: "16px",
          }}
        >
          {mockBrands.map((brand, index) => {
            const colors = brandColors[brand.slug] || {
              bg: "#1a1a1a",
              text: "#f5f5f5",
              accent: "#facc15",
            };
            return (
              <Link
                key={brand.id}
                href={`/catalog?brand=${brand.slug}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px",
                  padding: "24px 16px",
                  background: "#111111",
                  border: "1px solid #1a1a1a",
                  borderRadius: "12px",
                  textDecoration: "none",
                  transition: "all 0.25s",
                  animation: `fadeInUp 0.5s ease ${index * 0.08}s both`,
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = colors.accent + "44";
                  el.style.background = "#161616";
                  el.style.transform = "translateY(-4px)";
                  el.style.boxShadow = `0 8px 30px rgba(0,0,0,0.4), 0 0 0 1px ${colors.accent}22`;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "#1a1a1a";
                  el.style.background = "#111111";
                  el.style.transform = "translateY(0)";
                  el.style.boxShadow = "none";
                }}
              >
                {/* Brand logo area */}
                <div
                  style={{
                    width: "80px",
                    height: "40px",
                    background: colors.bg,
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "13px",
                    fontWeight: 900,
                    color: colors.text,
                    letterSpacing: "0.05em",
                    transition: "transform 0.2s",
                  }}
                >
                  {brand.name.toUpperCase()}
                </div>

                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#f5f5f5",
                      marginBottom: "2px",
                    }}
                  >
                    {brand.name}
                  </div>
                  <div style={{ fontSize: "11px", color: "#6b6b6b" }}>
                    {brand.description}
                  </div>
                </div>

                {/* Arrow indicator */}
                <div
                  style={{
                    fontSize: "11px",
                    color: "#4a4a4a",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  Ko&#39;rish <ArrowRight size={10} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
