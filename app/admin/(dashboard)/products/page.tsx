"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Filter,
  Download,
  Upload,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { mockProducts, formatPrice } from "@/lib/mock-data";

const statusColors: Record<string, { color: string; bg: string }> = {
  active: { color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
  inactive: { color: "#6b6b6b", bg: "rgba(107,107,107,0.1)" },
};

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchProducts();
  }, []);

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchBrand =
      selectedBrand === "all" || p.brand?.slug === selectedBrand;
    const matchStatus =
      selectedStatus === "all" ||
      (selectedStatus === "active" && p.isActive) ||
      (selectedStatus === "inactive" && !p.isActive);
    return matchSearch && matchBrand && matchStatus;
  });

  const toggleActive = async (id: string) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    try {
      const updatedStatus = !product.isActive;
      // Optimistic UI update
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isActive: updatedStatus } : p))
      );

      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...product,
          isActive: updatedStatus,
          brandId: product.brandId || product.brand?.id || "1",
          categoryId: product.categoryId || product.category?.id || "1",
        }),
      });
      if (!res.ok) throw new Error("Toggle status failed");
    } catch (err) {
      alert("Holatni o'zgartirishda xatolik yuz berdi");
      fetchProducts();
    }
  };

  const deleteProduct = async (id: string) => {
    if (confirm("Mahsulotni o'chirishni tasdiqlaysizmi?")) {
      try {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        const res = await fetch(`/api/products/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Delete failed");
      } catch (err) {
        alert("Mahsulotni o'chirishda xatolik yuz berdi");
        fetchProducts();
      }
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#f5f5f5" }}>
            Mahsulotlar
          </h1>
          <p style={{ fontSize: "13px", color: "#6b6b6b" }}>
            Jami {products.length} ta mahsulot
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "#111111",
              border: "1px solid #2a2a2a",
              color: "#a3a3a3",
              padding: "8px 14px",
              borderRadius: "8px",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            <Upload size={14} />
            Import
          </button>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "#111111",
              border: "1px solid #2a2a2a",
              color: "#a3a3a3",
              padding: "8px 14px",
              borderRadius: "8px",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            <Download size={14} />
            Export
          </button>
          <Link
            href="/admin/products/new"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "#facc15",
              color: "#0a0a0a",
              fontWeight: 700,
              padding: "8px 16px",
              borderRadius: "8px",
              fontSize: "13px",
              textDecoration: "none",
              transition: "all 0.2s",
            }}
          >
            <Plus size={16} />
            Yangi mahsulot
          </Link>
        </div>
      </div>

      {/* Filters bar */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        {/* Search */}
        <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
          <Search
            size={14}
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#6b6b6b",
            }}
          />
          <input
            type="text"
            placeholder="Nom yoki SKU bo'yicha qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              background: "#111111",
              border: "1px solid #2a2a2a",
              borderRadius: "8px",
              padding: "9px 12px 9px 34px",
              color: "#f5f5f5",
              fontSize: "13px",
              outline: "none",
            }}
          />
        </div>

        {/* Brand filter */}
        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          style={{
            background: "#111111",
            border: "1px solid #2a2a2a",
            borderRadius: "8px",
            padding: "9px 14px",
            color: "#f5f5f5",
            fontSize: "13px",
            outline: "none",
            cursor: "pointer",
          }}
        >
          <option value="all">Barcha brendlar</option>
          <option value="bosch">Bosch</option>
          <option value="milwaukee">Milwaukee</option>
          <option value="dewalt">DeWalt</option>
          <option value="makita">Makita</option>
          <option value="hilti">Hilti</option>
          <option value="metabo">Metabo</option>
        </select>

        {/* Status filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          style={{
            background: "#111111",
            border: "1px solid #2a2a2a",
            borderRadius: "8px",
            padding: "9px 14px",
            color: "#f5f5f5",
            fontSize: "13px",
            outline: "none",
            cursor: "pointer",
          }}
        >
          <option value="all">Barcha holat</option>
          <option value="active">Faol</option>
          <option value="inactive">Nofaol</option>
        </select>
      </div>

      {/* Table */}
      <div
        style={{
          background: "#111111",
          border: "1px solid #1a1a1a",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        {/* Table header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "40px 2fr 1fr 1fr 80px 80px 100px",
            gap: "0",
            padding: "12px 16px",
            borderBottom: "1px solid #1a1a1a",
            background: "#0d0d0d",
          }}
        >
          {["", "Mahsulot", "Brend", "Narx", "Zaxira", "Holat", "Amallar"].map(
            (h) => (
              <div
                key={h}
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#4a4a4a",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  padding: "0 8px",
                }}
              >
                {h}
              </div>
            )
          )}
        </div>

        {/* Table rows */}
        {filtered.length === 0 ? (
          <div
            style={{
              padding: "48px",
              textAlign: "center",
              color: "#6b6b6b",
              fontSize: "14px",
            }}
          >
            Hech narsa topilmadi
          </div>
        ) : (
          filtered.map((product, i) => (
            <div
              key={product.id}
              style={{
                display: "grid",
                gridTemplateColumns: "40px 2fr 1fr 1fr 80px 80px 100px",
                gap: "0",
                padding: "12px 16px",
                borderBottom:
                  i < filtered.length - 1 ? "1px solid #0f0f0f" : "none",
                alignItems: "center",
                transition: "background 0.15s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#161616";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              {/* Checkbox */}
              <div style={{ padding: "0 8px" }}>
                <input
                  type="checkbox"
                  style={{ accentColor: "#facc15", width: "14px", height: "14px" }}
                />
              </div>

              {/* Product info */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "0 8px",
                }}
              >
                {/* Thumbnail */}
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    background: "#1a1a1a",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "18px",
                    flexShrink: 0,
                    opacity: 0.4,
                  }}
                >
                  🔧
                </div>
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#f5f5f5",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {product.name}
                  </div>
                  <div style={{ fontSize: "11px", color: "#4a4a4a" }}>
                    {product.sku}
                    {product.isFeatured && (
                      <Star
                        size={10}
                        style={{
                          color: "#facc15",
                          marginLeft: "4px",
                          display: "inline",
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Brand */}
              <div style={{ padding: "0 8px" }}>
                <span
                  style={{
                    fontSize: "12px",
                    color: "#a3a3a3",
                    background: "#1a1a1a",
                    padding: "2px 8px",
                    borderRadius: "4px",
                  }}
                >
                  {product.brand.name}
                </span>
              </div>

              {/* Price */}
              <div style={{ padding: "0 8px" }}>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#facc15",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {formatPrice(product.price)}
                </div>
                {product.oldPrice && (
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#4a4a4a",
                      textDecoration: "line-through",
                    }}
                  >
                    {formatPrice(product.oldPrice)}
                  </div>
                )}
              </div>

              {/* Stock */}
              <div style={{ padding: "0 8px" }}>
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color:
                      product.stock <= 5
                        ? "#ef4444"
                        : product.stock <= 10
                        ? "#f59e0b"
                        : "#22c55e",
                  }}
                >
                  {product.stock}
                </span>
              </div>

              {/* Status */}
              <div style={{ padding: "0 8px" }}>
                <button
                  onClick={() => toggleActive(product.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: product.isActive
                      ? statusColors.active.color
                      : statusColors.inactive.color,
                    background: product.isActive
                      ? statusColors.active.bg
                      : statusColors.inactive.bg,
                    border: "none",
                    borderRadius: "4px",
                    padding: "3px 8px",
                    cursor: "pointer",
                  }}
                >
                  {product.isActive ? (
                    <Eye size={10} />
                  ) : (
                    <EyeOff size={10} />
                  )}
                  {product.isActive ? "Faol" : "Yopiq"}
                </button>
              </div>

              {/* Actions */}
              <div
                style={{
                  display: "flex",
                  gap: "4px",
                  padding: "0 8px",
                }}
              >
                <Link
                  href={`/product/${product.slug}`}
                  target="_blank"
                  title="Ko'rish"
                  style={{
                    width: "28px",
                    height: "28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#1a1a1a",
                    border: "1px solid #2a2a2a",
                    borderRadius: "6px",
                    color: "#6b6b6b",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#facc15";
                    e.currentTarget.style.color = "#facc15";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#2a2a2a";
                    e.currentTarget.style.color = "#6b6b6b";
                  }}
                >
                  <Eye size={12} />
                </Link>
                <Link
                  href={`/admin/products/${product.id}/edit`}
                  title="Tahrirlash"
                  style={{
                    width: "28px",
                    height: "28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#1a1a1a",
                    border: "1px solid #2a2a2a",
                    borderRadius: "6px",
                    color: "#6b6b6b",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#3b82f6";
                    e.currentTarget.style.color = "#3b82f6";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#2a2a2a";
                    e.currentTarget.style.color = "#6b6b6b";
                  }}
                >
                  <Edit size={12} />
                </Link>
                <button
                  onClick={() => deleteProduct(product.id)}
                  title="O'chirish"
                  style={{
                    width: "28px",
                    height: "28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#1a1a1a",
                    border: "1px solid #2a2a2a",
                    borderRadius: "6px",
                    color: "#6b6b6b",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#ef4444";
                    e.currentTarget.style.color = "#ef4444";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#2a2a2a";
                    e.currentTarget.style.color = "#6b6b6b";
                  }}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "16px",
          fontSize: "13px",
          color: "#6b6b6b",
        }}
      >
        <span>
          {filtered.length} ta mahsulot ko&#39;rsatilmoqda
        </span>
        <div style={{ display: "flex", gap: "4px" }}>
          <button
            style={{
              width: "32px",
              height: "32px",
              background: "#111111",
              border: "1px solid #2a2a2a",
              borderRadius: "6px",
              color: "#6b6b6b",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ChevronLeft size={14} />
          </button>
          {[1, 2, 3].map((p) => (
            <button
              key={p}
              style={{
                width: "32px",
                height: "32px",
                background: p === 1 ? "#facc15" : "#111111",
                border: p === 1 ? "none" : "1px solid #2a2a2a",
                borderRadius: "6px",
                color: p === 1 ? "#0a0a0a" : "#6b6b6b",
                cursor: "pointer",
                fontWeight: p === 1 ? 700 : 400,
                fontSize: "13px",
              }}
            >
              {p}
            </button>
          ))}
          <button
            style={{
              width: "32px",
              height: "32px",
              background: "#111111",
              border: "1px solid #2a2a2a",
              borderRadius: "6px",
              color: "#6b6b6b",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
