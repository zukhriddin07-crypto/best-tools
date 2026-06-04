"use client";

import React from "react";
import { ShoppingCart, Shield, Truck, Zap } from "lucide-react";
import { formatPrice } from "@/lib/mock-data";
import { useCart } from "@/lib/cart-context";
import { useLanguage } from "@/lib/language-context";


interface ProductActionsProps {
  id: string;
  sku: string;
  slug: string;
  image?: string;
  price: number;
  oldPrice?: number | null;
  installmentAvailable: boolean;
  stock: number;
  name: string;
}

export default function ProductActions({
  id,
  sku,
  slug,
  image,
  price,
  oldPrice,
  installmentAvailable,
  stock,
  name,
}: ProductActionsProps) {
  const { addToCart } = useCart();
  const { language, t } = useLanguage();
  const [isAdding, setIsAdding] = React.useState(false);
  const installmentMonths = [3, 6, 12];

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart({
      id,
      sku,
      slug,
      name,
      price,
      image: image || "",
    }, 1);
    setTimeout(() => setIsAdding(false), 1500);
  };


  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Price */}
      <div
        style={{
          background: "#111111",
          border: "1px solid #1a1a1a",
          borderRadius: "12px",
          padding: "20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "8px" }}>
          <span
            className="price-uzs"
            style={{ fontSize: "32px", fontWeight: 900, color: "#facc15" }}
          >
            {formatPrice(price, language)}
          </span>
          {oldPrice && (
            <span
              className="price-uzs"
              style={{ fontSize: "18px", color: "#4a4a4a", textDecoration: "line-through" }}
            >
              {formatPrice(oldPrice, language)}
            </span>
          )}
        </div>

        {/* Installment options */}
        {installmentAvailable && (
          <div>
            <div
              style={{
                fontSize: "12px",
                color: "#6b6b6b",
                marginBottom: "10px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Zap size={12} style={{ color: "#facc15" }} />
              {t("uzumNasiyaInstallment")}
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              {installmentMonths.map((months) => (
                <div
                  key={months}
                  style={{
                    flex: 1,
                    background: "#1a1a1a",
                    border: "1px solid #2a2a2a",
                    borderRadius: "8px",
                    padding: "8px 4px",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(250,204,21,0.4)";
                    e.currentTarget.style.background = "rgba(250,204,21,0.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#2a2a2a";
                    e.currentTarget.style.background = "#1a1a1a";
                  }}
                >
                  <div style={{ fontSize: "11px", color: "#6b6b6b" }}>{months} {t("months")}</div>
                  <div
                    className="price-uzs"
                    style={{ fontSize: "12px", fontWeight: 700, color: "#facc15" }}
                  >
                    {formatPrice(Math.ceil(price / months), language)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Stock */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: stock > 5 ? "#22c55e" : stock > 0 ? "#f59e0b" : "#ef4444",
          }}
        />
        <span style={{ fontSize: "13px", color: "#a3a3a3" }}>
          {stock > 5 ? t("inStock") : stock > 0 ? `${t("onlyLeftPrefix")}${stock} ${t("onlyLeft")}` : t("outOfStock")}
        </span>
      </div>

      {/* CTA buttons */}
      <div style={{ display: "flex", gap: "12px" }}>
        <button
          onClick={handleAddToCart}
          disabled={stock === 0 || isAdding}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            background: isAdding ? "#eab308" : stock === 0 ? "#1a1a1a" : "#facc15",
            color: stock === 0 ? "#4a4a4a" : "#0a0a0a",
            fontWeight: 700,
            padding: "14px",
            borderRadius: "10px",
            border: "none",
            cursor: stock === 0 ? "not-allowed" : "pointer",
            fontSize: "15px",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            if (stock > 0 && !isAdding) {
              e.currentTarget.style.background = "#eab308";
              e.currentTarget.style.boxShadow = "0 0 30px rgba(250,204,21,0.4)";
            }
          }}
          onMouseLeave={(e) => {
            if (stock > 0 && !isAdding) {
              e.currentTarget.style.background = "#facc15";
              e.currentTarget.style.boxShadow = "none";
            }
          }}
        >
          <ShoppingCart size={18} />
          {isAdding ? t("added") : stock === 0 ? t("outOfStock") : t("addToCart")}
        </button>

        <button
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "transparent",
            color: "#f5f5f5",
            fontWeight: 600,
            padding: "14px",
            borderRadius: "10px",
            border: "1px solid rgba(255,255,255,0.15)",
            cursor: "pointer",
            fontSize: "15px",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(250,204,21,0.4)";
            e.currentTarget.style.color = "#facc15";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
            e.currentTarget.style.color = "#f5f5f5";
          }}
        >
          {t("oneClick")}
        </button>
      </div>

      {/* Trust badges */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
        {[
          { icon: Shield, text: t("warranty") },
          { icon: Truck, text: t("fastDelivery") },
        ].map(({ icon: Icon, text }) => (
          <div
            key={text}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 12px",
              background: "#111111",
              border: "1px solid #1a1a1a",
              borderRadius: "8px",
            }}
          >
            <Icon size={14} style={{ color: "#facc15" }} />
            <span style={{ fontSize: "12px", color: "#a3a3a3" }}>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
