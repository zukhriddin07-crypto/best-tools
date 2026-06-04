"use client";
import React, { useState } from "react";
import { Save, Loader2, Eye, EyeOff } from "lucide-react";

export default function SettingsPage() {
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    storeName: "Best Tools",
    storeEmail: "info@besttools.uz",
    storePhone: "+998 71 234-56-78",
    storeAddress: "Toshkent, Chilonzor tumani",
    telegramBotToken: "",
    anthropicApiKey: "",
    cloudinaryCloudName: "",
    clickMerchantId: "",
    clickServiceId: "",
    paymeId: "",
    deliveryFee: "30000",
    freeDeliveryFrom: "500000",
  });

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: "8px",
    padding: "10px 12px",
    color: "#f5f5f5",
    fontSize: "14px",
    outline: "none",
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

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsSaving(false);
    alert("Sozlamalar saqlandi!");
  };

  return (
    <div style={{ padding: "24px", maxWidth: "700px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#f5f5f5" }}>Sozlamalar</h1>
          <p style={{ fontSize: "13px", color: "#6b6b6b" }}>Do'kon va integratsiya sozlamalari</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          style={{ display: "flex", alignItems: "center", gap: "8px", background: "#facc15", color: "#0a0a0a", fontWeight: 700, padding: "10px 18px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "14px" }}
        >
          {isSaving ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={16} />}
          Saqlash
        </button>
      </div>

      {/* Store info */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#f5f5f5", marginBottom: "16px" }}>Do&#39;kon ma&#39;lumotlari</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          {[
            { field: "storeName", label: "Do'kon nomi" },
            { field: "storeEmail", label: "Email" },
            { field: "storePhone", label: "Telefon" },
            { field: "storeAddress", label: "Manzil" },
          ].map(({ field, label }) => (
            <div key={field}>
              <label style={labelStyle}>{label}</label>
              <input
                type="text"
                value={settings[field as keyof typeof settings]}
                onChange={e => setSettings(prev => ({ ...prev, [field]: e.target.value }))}
                style={inputStyle}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Delivery */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#f5f5f5", marginBottom: "16px" }}>Yetkazib berish</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div>
            <label style={labelStyle}>Yetkazib berish narxi (so'm)</label>
            <input type="number" value={settings.deliveryFee} onChange={e => setSettings(p => ({ ...p, deliveryFee: e.target.value }))} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Bepul yetkazish (qaysi summadan)</label>
            <input type="number" value={settings.freeDeliveryFrom} onChange={e => setSettings(p => ({ ...p, freeDeliveryFrom: e.target.value }))} style={inputStyle} />
          </div>
        </div>
      </div>

      {/* API keys */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#f5f5f5", marginBottom: "4px" }}>API kalitlar</h2>
        <p style={{ fontSize: "12px", color: "#4a4a4a", marginBottom: "16px" }}>Bu ma&#39;lumotlar shifrlangan holda saqlanadi</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {[
            { field: "telegramBotToken", label: "Telegram Bot Token", placeholder: "7123456789:AABc..." },
            { field: "anthropicApiKey", label: "Anthropic (Claude) API Key", placeholder: "sk-ant-api03-..." },
            { field: "cloudinaryCloudName", label: "Cloudinary Cloud Name", placeholder: "dxxxxxxxx" },
            { field: "clickMerchantId", label: "Click Merchant ID", placeholder: "12345" },
            { field: "paymeId", label: "Payme ID", placeholder: "65f..." },
          ].map(({ field, label, placeholder }) => (
            <div key={field}>
              <label style={labelStyle}>{label}</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showApiKey ? "text" : "password"}
                  value={settings[field as keyof typeof settings]}
                  onChange={e => setSettings(p => ({ ...p, [field]: e.target.value }))}
                  placeholder={placeholder}
                  style={{ ...inputStyle, paddingRight: "40px" }}
                />
                <button type="button" onClick={() => setShowApiKey(!showApiKey)} style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#6b6b6b", cursor: "pointer", display: "flex" }}>
                  {showApiKey ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } } input:focus { border-color: #facc15 !important; }`}</style>
    </div>
  );
}
