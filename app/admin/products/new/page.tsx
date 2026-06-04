"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  X,
  Sparkles,
  Plus,
  Trash2,
  ArrowLeft,
  Save,
  Loader2,
  ImagePlus,
  Info,
} from "lucide-react";
import { mockBrands, mockCategories } from "@/lib/mock-data";

interface SpecRow {
  key: string;
  value: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuccess, setAiSuccess] = useState(false);

  const [form, setForm] = useState({
    name: "",
    nameRu: "",
    sku: "",
    slug: "",
    brandId: "",
    categoryId: "",
    price: "",
    oldPrice: "",
    stock: "",
    shortDesc: "",
    description: "",
    descriptionRu: "",
    metaTitle: "",
    metaDescription: "",
    isActive: true,
    isFeatured: false,
    installmentAvailable: true,
  });

  const [specs, setSpecs] = useState<SpecRow[]>([
    { key: "voltage", value: "" },
    { key: "power", value: "" },
  ]);

  const [images, setImages] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const updateField = (field: string, value: string | boolean) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      // Auto-generate slug from name
      if (field === "name") {
        updated.slug = (value as string)
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .trim();
      }
      return updated;
    });
  };

  const addSpec = () => {
    setSpecs((prev) => [...prev, { key: "", value: "" }]);
  };

  const removeSpec = (index: number) => {
    setSpecs((prev) => prev.filter((_, i) => i !== index));
  };

  const updateSpec = (index: number, field: "key" | "value", value: string) => {
    setSpecs((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  };

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImages((prev) => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAiFill = async () => {
    if (!form.name && !form.sku) {
      alert("Avval mahsulot nomi yoki SKU kiriting");
      return;
    }
    setIsAiLoading(true);
    setAiSuccess(false);

    try {
      const response = await fetch("/api/ai/product-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name || form.sku,
          sku: form.sku,
          brandId: form.brandId,
          images: images,
        }),
      });

      if (!response.ok) throw new Error("AI so'rov muvaffaqiyatsiz");

      const data = await response.json();

      setForm((prev) => ({
        ...prev,
        name: data.name || prev.name,
        nameRu: data.nameRu || prev.nameRu,
        shortDesc: data.shortDesc || prev.shortDesc,
        description: data.description || prev.description,
        descriptionRu: data.descriptionRu || prev.descriptionRu,
        metaTitle: data.metaTitle || prev.metaTitle,
        metaDescription: data.metaDescription || prev.metaDescription,
      }));

      if (data.specs) {
        setSpecs(
          Object.entries(data.specs).map(([key, value]) => ({
            key,
            value: String(value),
          }))
        );
      }

      setAiSuccess(true);
      setTimeout(() => setAiSuccess(false), 3000);
    } catch (error) {
      alert("AI xizmati hozir mavjud emas. Keyinroq urinib ko'ring.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // TODO: POST /api/admin/products
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    router.push("/admin/products");
  };

  // Input style helper
  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: "8px",
    padding: "10px 12px",
    color: "#f5f5f5",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "12px",
    fontWeight: 600,
    color: "#6b6b6b",
    marginBottom: "6px",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  };

  const cardStyle: React.CSSProperties = {
    background: "#111111",
    border: "1px solid #1a1a1a",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "16px",
  };

  return (
    <div style={{ padding: "24px", maxWidth: "1000px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        <button
          onClick={() => router.back()}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "#111111",
            border: "1px solid #2a2a2a",
            borderRadius: "8px",
            padding: "8px 12px",
            color: "#a3a3a3",
            cursor: "pointer",
            fontSize: "13px",
          }}
        >
          <ArrowLeft size={14} />
          Orqaga
        </button>
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: 800, color: "#f5f5f5" }}>
            Yangi mahsulot qo&#39;shish
          </h1>
          <p style={{ fontSize: "12px", color: "#6b6b6b" }}>
            Barcha kerakli maydonlarni to&#39;ldiring
          </p>
        </div>

        {/* AI fill button */}
        <div style={{ marginLeft: "auto" }}>
          <button
            type="button"
            onClick={handleAiFill}
            disabled={isAiLoading}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: aiSuccess
                ? "rgba(34,197,94,0.15)"
                : isAiLoading
                ? "rgba(250,204,21,0.1)"
                : "rgba(250,204,21,0.1)",
              border: `1px solid ${aiSuccess ? "rgba(34,197,94,0.4)" : "rgba(250,204,21,0.3)"}`,
              color: aiSuccess ? "#22c55e" : "#facc15",
              fontWeight: 700,
              padding: "10px 18px",
              borderRadius: "10px",
              fontSize: "14px",
              cursor: isAiLoading ? "not-allowed" : "pointer",
              transition: "all 0.2s",
            }}
          >
            {isAiLoading ? (
              <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
            ) : (
              <Sparkles size={16} />
            )}
            {isAiLoading
              ? "AI to'ldirmoqda..."
              : aiSuccess
              ? "✓ AI to'ldirdi!"
              : "AI bilan to'ldirish"}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 320px",
            gap: "16px",
            alignItems: "flex-start",
          }}
          className="product-form-grid"
        >
          {/* Left column */}
          <div>
            {/* Basic info */}
            <div style={cardStyle}>
              <h2
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#f5f5f5",
                  marginBottom: "16px",
                }}
              >
                Asosiy ma&#39;lumotlar
              </h2>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Mahsulot nomi (O&#39;zbek) *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="Bosch GSB 18V-50 Professional"
                    required
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Nomi (Rus)</label>
                  <input
                    type="text"
                    value={form.nameRu}
                    onChange={(e) => updateField("nameRu", e.target.value)}
                    placeholder="Bosch GSB 18V-50 Professional"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>SKU *</label>
                  <input
                    type="text"
                    value={form.sku}
                    onChange={(e) => updateField("sku", e.target.value)}
                    placeholder="GSB-18V-50"
                    required
                    style={inputStyle}
                  />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Slug (URL)</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => updateField("slug", e.target.value)}
                    placeholder="bosch-gsb-18v-50-professional"
                    style={{ ...inputStyle, color: "#6b6b6b" }}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Brend *</label>
                  <select
                    value={form.brandId}
                    onChange={(e) => updateField("brandId", e.target.value)}
                    required
                    style={{ ...inputStyle, cursor: "pointer" }}
                  >
                    <option value="">Tanlang...</option>
                    {mockBrands.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Kategoriya *</label>
                  <select
                    value={form.categoryId}
                    onChange={(e) => updateField("categoryId", e.target.value)}
                    required
                    style={{ ...inputStyle, cursor: "pointer" }}
                  >
                    <option value="">Tanlang...</option>
                    {mockCategories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Description */}
            <div style={cardStyle}>
              <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#f5f5f5", marginBottom: "16px" }}>
                Tavsif
              </h2>

              <div style={{ marginBottom: "12px" }}>
                <label style={labelStyle}>Qisqa tavsif</label>
                <input
                  type="text"
                  value={form.shortDesc}
                  onChange={(e) => updateField("shortDesc", e.target.value)}
                  placeholder="Akkumulyatorli drel, 18V, professional"
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: "12px" }}>
                <label style={labelStyle}>To&#39;liq tavsif (O&#39;zbek)</label>
                <textarea
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  placeholder="Mahsulot haqida batafsil ma'lumot..."
                  rows={5}
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                    fontFamily: "inherit",
                    lineHeight: 1.6,
                  }}
                />
              </div>

              <div>
                <label style={labelStyle}>To&#39;liq tavsif (Rus)</label>
                <textarea
                  value={form.descriptionRu}
                  onChange={(e) => updateField("descriptionRu", e.target.value)}
                  placeholder="Подробное описание товара..."
                  rows={4}
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                    fontFamily: "inherit",
                    lineHeight: 1.6,
                  }}
                />
              </div>
            </div>

            {/* Specs */}
            <div style={cardStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#f5f5f5" }}>
                  Texnik xususiyatlar
                </h2>
                <button
                  type="button"
                  onClick={addSpec}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    background: "transparent",
                    border: "1px dashed #2a2a2a",
                    borderRadius: "6px",
                    padding: "5px 10px",
                    color: "#6b6b6b",
                    cursor: "pointer",
                    fontSize: "12px",
                    transition: "all 0.15s",
                  }}
                >
                  <Plus size={12} />
                  Qo&#39;shish
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {specs.map((spec, i) => (
                  <div key={i} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <input
                      type="text"
                      placeholder="Kalit (voltage)"
                      value={spec.key}
                      onChange={(e) => updateSpec(i, "key", e.target.value)}
                      style={{ ...inputStyle, flex: 1 }}
                    />
                    <input
                      type="text"
                      placeholder="Qiymat (18V)"
                      value={spec.value}
                      onChange={(e) => updateSpec(i, "value", e.target.value)}
                      style={{ ...inputStyle, flex: 2 }}
                    />
                    <button
                      type="button"
                      onClick={() => removeSpec(i)}
                      style={{
                        background: "none",
                        border: "1px solid #2a2a2a",
                        borderRadius: "6px",
                        padding: "8px",
                        color: "#4a4a4a",
                        cursor: "pointer",
                        display: "flex",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = "#ef4444"; e.currentTarget.style.borderColor = "#ef4444"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = "#4a4a4a"; e.currentTarget.style.borderColor = "#2a2a2a"; }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* SEO */}
            <div style={cardStyle}>
              <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#f5f5f5", marginBottom: "16px" }}>
                SEO
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <label style={labelStyle}>Meta Title</label>
                  <input
                    type="text"
                    value={form.metaTitle}
                    onChange={(e) => updateField("metaTitle", e.target.value)}
                    placeholder="Bosch GSB 18V-50 | Best Tools"
                    style={inputStyle}
                  />
                  <div style={{ fontSize: "11px", color: "#4a4a4a", marginTop: "4px" }}>
                    {form.metaTitle.length}/60 belgi
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Meta Description</label>
                  <textarea
                    value={form.metaDescription}
                    onChange={(e) => updateField("metaDescription", e.target.value)}
                    placeholder="Professional akkumulyatorli drel..."
                    rows={3}
                    style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
                  />
                  <div style={{ fontSize: "11px", color: "#4a4a4a", marginTop: "4px" }}>
                    {form.metaDescription.length}/160 belgi
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div>
            {/* Images */}
            <div style={cardStyle}>
              <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#f5f5f5", marginBottom: "12px" }}>
                Rasmlar
              </h2>

              {/* Drop zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  handleImageUpload(e.dataTransfer.files);
                }}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: `2px dashed ${dragOver ? "#facc15" : "#2a2a2a"}`,
                  borderRadius: "10px",
                  padding: "24px",
                  textAlign: "center",
                  cursor: "pointer",
                  background: dragOver ? "rgba(250,204,21,0.03)" : "transparent",
                  transition: "all 0.2s",
                  marginBottom: "12px",
                }}
              >
                <ImagePlus size={24} style={{ color: "#4a4a4a", margin: "0 auto 8px" }} />
                <div style={{ fontSize: "13px", color: "#6b6b6b" }}>
                  Rasm tanlash yoki bu yerga tashlash
                </div>
                <div style={{ fontSize: "11px", color: "#3a3a3a", marginTop: "4px" }}>
                  JPG, PNG, WebP · Max 5MB
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: "none" }}
                onChange={(e) => handleImageUpload(e.target.files)}
              />

              {/* Uploaded images */}
              {images.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  {images.map((img, i) => (
                    <div key={i} style={{ position: "relative", aspectRatio: "1/1" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img}
                        alt={`Rasm ${i + 1}`}
                        style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "6px" }}
                      />
                      <button
                        type="button"
                        onClick={() => setImages((p) => p.filter((_, idx) => idx !== i))}
                        style={{
                          position: "absolute",
                          top: "4px",
                          right: "4px",
                          background: "rgba(0,0,0,0.8)",
                          border: "none",
                          borderRadius: "50%",
                          width: "22px",
                          height: "22px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          cursor: "pointer",
                        }}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pricing */}
            <div style={cardStyle}>
              <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#f5f5f5", marginBottom: "12px" }}>
                Narx va zaxira
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div>
                  <label style={labelStyle}>Narx (so&#39;m) *</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => updateField("price", e.target.value)}
                    placeholder="2 890 000"
                    required
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Eski narx (chegirma uchun)</label>
                  <input
                    type="number"
                    value={form.oldPrice}
                    onChange={(e) => updateField("oldPrice", e.target.value)}
                    placeholder="3 200 000"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Zaxira (dona) *</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => updateField("stock", e.target.value)}
                    placeholder="0"
                    required
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>

            {/* Options */}
            <div style={cardStyle}>
              <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#f5f5f5", marginBottom: "12px" }}>
                Parametrlar
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  { field: "isActive", label: "Faol (saytda ko'rinadi)" },
                  { field: "isFeatured", label: "Tanlangan (bosh sahifada)" },
                  { field: "installmentAvailable", label: "Bo'lib to'lash mavjud" },
                ].map(({ field, label }) => (
                  <label
                    key={field}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={form[field as keyof typeof form] as boolean}
                      onChange={(e) => updateField(field, e.target.checked)}
                      style={{ accentColor: "#facc15", width: "16px", height: "16px" }}
                    />
                    <span style={{ fontSize: "13px", color: "#a3a3a3" }}>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                background: isSubmitting ? "#a08a0a" : "#facc15",
                color: "#0a0a0a",
                fontWeight: 700,
                padding: "14px",
                borderRadius: "10px",
                border: "none",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                fontSize: "15px",
                transition: "all 0.2s",
              }}
            >
              {isSubmitting ? (
                <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
              ) : (
                <Save size={18} />
              )}
              {isSubmitting ? "Saqlanmoqda..." : "Saqlash"}
            </button>
          </div>
        </div>
      </form>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 900px) {
          .product-form-grid {
            grid-template-columns: 1fr !important;
          }
        }
        input:focus, textarea:focus, select:focus {
          border-color: #facc15 !important;
          box-shadow: 0 0 0 3px rgba(250,204,21,0.1) !important;
        }
      `}</style>
    </div>
  );
}
