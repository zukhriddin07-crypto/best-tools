"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Star, Zap } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPrice, calculateDiscount } from "@/lib/mock-data";
import { useLanguage } from "@/lib/language-context";


interface Product {
  id: string;
  name: string;
  nameRu?: string | null;
  slug: string;
  sku: string;
  shortDesc?: string;
  price: number;
  oldPrice?: number | null;
  stock: number;
  brand: { name: string; slug: string };
  category: { name: string; slug: string };
  images: string[];
  rating: number;
  isFeatured: boolean;
  installmentAvailable: boolean;
  specs: Record<string, string | undefined>;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addToCart } = useCart();
  const { language, t } = useLanguage();
  const discount =
    product.oldPrice ? calculateDiscount(product.price, product.oldPrice) : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAddingToCart(true);
    addToCart({
      id: product.id,
      name: language === "ru" && product.nameRu ? product.nameRu : product.name,
      price: product.price,
      sku: product.sku,
      slug: product.slug,
      image: product.images[0] || "",
    }, 1);
    setTimeout(() => setIsAddingToCart(false), 1500);
  };


  // Monthly installment calculation (12 months)
  const monthlyPrice = product.installmentAvailable
    ? Math.ceil(product.price / 12)
    : null;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="product-card"
      style={{ display: "flex", flexDirection: "column", height: "100%" }}
    >
      {/* Image area */}
      <div
        style={{
          position: "relative",
          aspectRatio: "1 / 1",
          background: "linear-gradient(135deg, #141414 0%, #1a1a1a 100%)",
          overflow: "hidden",
        }}
      >
        {/* Placeholder image with tool silhouette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "64px",
            opacity: 0.15,
          }}
        >
          🔧
        </div>

        {/* Brand badge */}
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "6px",
            padding: "3px 8px",
            fontSize: "11px",
            fontWeight: 700,
            color: "#a3a3a3",
            letterSpacing: "0.05em",
          }}
        >
          {product.brand.name.toUpperCase()}
        </div>

        {/* Badges */}
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            alignItems: "flex-end",
          }}
        >
          {discount && (
            <span className="badge-sale">-{discount}%</span>
          )}
          {product.isFeatured && (
            <span
              style={{
                background: "rgba(250,204,21,0.15)",
                color: "#facc15",
                fontSize: "10px",
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: "4px",
                border: "1px solid rgba(250,204,21,0.3)",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Top
            </span>
          )}
        </div>

        {/* Stock indicator */}
        {product.stock <= 5 && product.stock > 0 && (
          <div
            style={{
              position: "absolute",
              bottom: "10px",
              left: "10px",
              background: "rgba(239,68,68,0.15)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: "4px",
              padding: "2px 8px",
              fontSize: "10px",
              color: "#ef4444",
              fontWeight: 600,
            }}
          >
            {language === "ru" ? `Осталось всего ${product.stock} шт` : `Faqat ${product.stock} ta qoldi`}
          </div>
        )}
      </div>

      {/* Content */}
      <div
        style={{
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          gap: "8px",
        }}
      >
        {/* Rating */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div className="stars" style={{ display: "flex", gap: "1px" }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={12}
                fill={star <= Math.round(product.rating) ? "#facc15" : "none"}
                color={star <= Math.round(product.rating) ? "#facc15" : "#3a3a3a"}
              />
            ))}
          </div>
          <span style={{ fontSize: "11px", color: "#6b6b6b" }}>
            {product.rating.toFixed(1)}
          </span>
        </div>

        {/* Name */}
        <h3
          style={{
            fontSize: "14px",
            fontWeight: 600,
            color: "#f5f5f5",
            lineHeight: 1.4,
            flex: 1,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {language === "ru" && product.nameRu ? product.nameRu : product.name}
        </h3>

        {/* SKU */}
        <div style={{ fontSize: "11px", color: "#4a4a4a" }}>
          SKU: {product.sku}
        </div>

        {/* Price section */}
        <div style={{ marginTop: "auto" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px", flexWrap: "wrap" }}>
            <span
              className="price-uzs"
              style={{
                fontSize: "18px",
                fontWeight: 800,
                color: "#facc15",
              }}
            >
              {formatPrice(product.price, language)}
            </span>
            {product.oldPrice && (
              <span
                className="price-uzs"
                style={{
                  fontSize: "13px",
                  color: "#4a4a4a",
                  textDecoration: "line-through",
                }}
              >
                {formatPrice(product.oldPrice, language)}
              </span>
            )}
          </div>

          {/* Installment */}
          {monthlyPrice && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "11px",
                color: "#6b6b6b",
                marginTop: "3px",
              }}
            >
              <Zap size={10} style={{ color: "#facc15" }} />
              {language === "ru" ? (
                <>В рассрочку: {formatPrice(monthlyPrice, language)}/мес</>
              ) : (
                <>12 oyga: {formatPrice(monthlyPrice, language)}/oy</>
              )}
            </div>
          )}
        </div>

        {/* Add to cart button */}
        <button
          onClick={handleAddToCart}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            background: isAddingToCart ? "#eab308" : "#facc15",
            color: "#0a0a0a",
            fontWeight: 700,
            padding: "10px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontSize: "13px",
            transition: "all 0.2s",
            marginTop: "8px",
          }}
          onMouseEnter={(e) => {
            if (!isAddingToCart) {
              e.currentTarget.style.background = "#eab308";
              e.currentTarget.style.boxShadow = "0 0 20px rgba(250,204,21,0.3)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#facc15";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <ShoppingCart size={15} />
          {isAddingToCart ? (language === "ru" ? "Добавлено ✓" : "Qo'shildi ✓") : (language === "ru" ? "В корзину" : "Savatga")}
        </button>
      </div>
    </Link>
  );
}
