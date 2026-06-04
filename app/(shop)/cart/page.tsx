"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, Percent, Zap } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/mock-data";
import { useLanguage } from "@/lib/language-context";

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, isMounted } = useCart();
  const { language, t } = useLanguage();
  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");

  if (!isMounted) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#a3a3a3", fontSize: "14px" }}>
          {language === "ru" ? "Загрузка корзины..." : "Savat yuklanmoqda..."}
        </div>
      </div>
    );
  }

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError("");
    setPromoSuccess("");

    if (promoCode.trim().toUpperCase() === "BEST5") {
      setDiscountPercent(5);
      setPromoSuccess(
        language === "ru"
          ? "Промокод активирован: скидка -5%"
          : "Promokod faollashtirildi: -5% chegirma"
      );
    } else if (promoCode.trim().toUpperCase() === "WELCOME10") {
      setDiscountPercent(10);
      setPromoSuccess(
        language === "ru"
          ? "Промокод активирован: скидка -10%"
          : "Promokod faollashtirildi: -10% chegirma"
      );
    } else {
      setPromoError(
        language === "ru"
          ? "Неверный или устаревший промокод"
          : "Noto'g'ri yoki eskirgan promokod"
      );
      setDiscountPercent(0);
    }
  };

  const shippingFee = cartTotal > 5000000 ? 0 : cartTotal > 0 ? 25000 : 0;
  const discountAmount = Math.round((cartTotal * discountPercent) / 100);
  const finalTotal = cartTotal - discountAmount + shippingFee;

  if (cartItems.length === 0) {
    return (
      <div className="container-main" style={{ padding: "60px 20px", textAlign: "center" }}>
        <div
          style={{
            width: "80px",
            height: "80px",
            background: "#111111",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
            color: "#6b6b6b",
          }}
        >
          <ShoppingBag size={32} />
        </div>
        <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#f5f5f5", marginBottom: "12px" }}>
          {t("emptyCart")}
        </h1>
        <p style={{ fontSize: "14px", color: "#6b6b6b", maxWidth: "400px", margin: "0 auto 24px" }}>
          {t("emptyCartDesc")}
        </p>
        <Link
          href="/catalog"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "#facc15",
            color: "#0a0a0a",
            fontWeight: 700,
            padding: "12px 24px",
            borderRadius: "10px",
            textDecoration: "none",
            fontSize: "14px",
            transition: "all 0.2s",
          }}
        >
          {language === "ru" ? "Перейти в каталог" : "Katalogga o'tish"}
        </Link>
      </div>
    );
  }

  return (
    <div className="container-main" style={{ paddingTop: "32px", paddingBottom: "60px" }}>
      {/* Title */}
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#f5f5f5" }}>{t("cartTitle")}</h1>
        <p style={{ fontSize: "14px", color: "#6b6b6b" }}>
          {language === "ru"
            ? `Вы выбрали ${cartItems.length} товаров`
            : `Siz tanlagan ${cartItems.length} ta mahsulot`}
        </p>
      </div>

      {/* Grid */}
      <div
        className="cart-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 340px",
          gap: "24px",
          alignItems: "flex-start",
        }}
      >
        {/* Left Column: Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {cartItems.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                background: "#111111",
                border: "1px solid #1a1a1a",
                borderRadius: "12px",
                padding: "16px",
                gap: "16px",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {/* Product Image */}
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  background: "linear-gradient(135deg, #181818 0%, #202020 100%)",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "32px",
                  flexShrink: 0,
                  opacity: 0.3,
                }}
              >
                🔧
              </div>

              {/* Title & SKU */}
              <div style={{ flex: 1, minWidth: "180px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#f5f5f5", marginBottom: "4px" }}>
                  <Link href={`/product/${item.slug}`} style={{ color: "#f5f5f5", textDecoration: "none" }}>
                    {item.name}
                  </Link>
                </h3>
                <div style={{ fontSize: "11px", color: "#4a4a4a" }}>SKU: {item.sku}</div>
              </div>

              {/* Quantity selectors */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "#1a1a1a",
                  border: "1px solid #2a2a2a",
                  borderRadius: "8px",
                  padding: "4px",
                }}
              >
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#a3a3a3",
                    cursor: "pointer",
                    padding: "4px 8px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Minus size={14} />
                </button>
                <span
                  style={{
                    width: "30px",
                    textAlign: "center",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#f5f5f5",
                  }}
                >
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#a3a3a3",
                    cursor: "pointer",
                    padding: "4px 8px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Pricing */}
              <div style={{ textAlign: "right", minWidth: "120px" }}>
                <div style={{ fontSize: "15px", fontWeight: 800, color: "#facc15" }}>
                  {formatPrice(item.price * item.quantity)}
                </div>
                {item.quantity > 1 && (
                  <div style={{ fontSize: "11px", color: "#6b6b6b", marginTop: "2px" }}>
                    {formatPrice(item.price)} / {language === "ru" ? "шт." : "dona"}
                  </div>
                )}
              </div>

              {/* Remove */}
              <button
                onClick={() => removeFromCart(item.id)}
                style={{
                  background: "none",
                  border: "1px solid #1a1a1a",
                  borderRadius: "8px",
                  padding: "8px",
                  color: "#4a4a4a",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  display: "flex",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#ef4444";
                  e.currentTarget.style.borderColor = "#ef4444";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#4a4a4a";
                  e.currentTarget.style.borderColor = "#1a1a1a";
                }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          {/* Continue shopping */}
          <Link
            href="/catalog"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              color: "#a3a3a3",
              fontSize: "13px",
              textDecoration: "none",
              marginTop: "8px",
              width: "fit-content",
            }}
          >
            <ArrowLeft size={14} />
            {t("continueShopping")}
          </Link>
        </div>

        {/* Right Column: Summary */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Order Summary Box */}
          <div
            style={{
              background: "#111111",
              border: "1px solid #1a1a1a",
              borderRadius: "12px",
              padding: "20px",
            }}
          >
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#f5f5f5", marginBottom: "16px" }}>
              {t("cartSummary")}
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#a3a3a3" }}>
                <span>{t("subtotal")}</span>
                <span style={{ color: "#f5f5f5", fontWeight: 500 }}>{formatPrice(cartTotal)}</span>
              </div>
              {discountPercent > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#ef4444" }}>
                  <span>{t("discount")} ({discountPercent}%)</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#a3a3a3" }}>
                <span>{t("delivery")}</span>
                <span style={{ color: shippingFee === 0 ? "#22c55e" : "#f5f5f5", fontWeight: 500 }}>
                  {shippingFee === 0 ? (language === "ru" ? "Бесплатно" : "Bepul") : formatPrice(shippingFee)}
                </span>
              </div>

              {shippingFee > 0 && (
                <div
                  style={{
                    fontSize: "11px",
                    color: "#6b6b6b",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <Zap size={10} style={{ color: "#facc15" }} />
                  {t("freeDeliveryThreshold")}
                </div>
              )}
            </div>

            <div
              style={{
                borderTop: "1px solid #1a1a1a",
                paddingTop: "16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: "20px",
              }}
            >
              <span style={{ fontSize: "15px", fontWeight: 700, color: "#f5f5f5" }}>{t("total")}</span>
              <span style={{ fontSize: "22px", fontWeight: 900, color: "#facc15" }}>{formatPrice(finalTotal)}</span>
            </div>

            {/* Checkout Button */}
            <Link
              href="/checkout"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#facc15",
                color: "#0a0a0a",
                fontWeight: 700,
                padding: "14px",
                borderRadius: "10px",
                textDecoration: "none",
                fontSize: "15px",
                textAlign: "center",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#eab308";
                e.currentTarget.style.boxShadow = "0 0 20px rgba(250,204,21,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#facc15";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {t("checkoutBtn")}
            </Link>
          </div>

          {/* Promo code Box */}
          <div
            style={{
              background: "#111111",
              border: "1px solid #1a1a1a",
              borderRadius: "12px",
              padding: "16px",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#6b6b6b",
                marginBottom: "10px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                textTransform: "uppercase",
              }}
            >
              <Percent size={12} style={{ color: "#facc15" }} />
              {t("promoCode")}?
            </div>
            <form onSubmit={handleApplyPromo} style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                placeholder="BEST5 yoki WELCOME10"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                style={{
                  flex: 1,
                  background: "#1a1a1a",
                  border: "1px solid #2a2a2a",
                  borderRadius: "8px",
                  padding: "8px 10px",
                  color: "#f5f5f5",
                  fontSize: "13px",
                  outline: "none",
                }}
              />
              <button
                type="submit"
                style={{
                  background: "#1a1a1a",
                  border: "1px solid #2a2a2a",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  color: "#f5f5f5",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {t("apply")}
              </button>
            </form>
            {promoError && (
              <div style={{ color: "#ef4444", fontSize: "11px", marginTop: "6px" }}>{promoError}</div>
            )}
            {promoSuccess && (
              <div style={{ color: "#22c55e", fontSize: "11px", marginTop: "6px" }}>{promoSuccess}</div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 800px) {
          .cart-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
