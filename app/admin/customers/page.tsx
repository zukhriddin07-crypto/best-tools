"use client";
import React from "react";
import { Search } from "lucide-react";

const mockCustomers = [
  { id: "1", name: "Jasur Toshmatov", phone: "+998901234567", orders: 5, totalSpent: 14500000, lastOrder: "2026-06-04", status: "ACTIVE" },
  { id: "2", name: "Sherzod Yusupov", phone: "+998931234567", orders: 2, totalSpent: 5780000, lastOrder: "2026-06-04", status: "ACTIVE" },
  { id: "3", name: "Dildora Xasanova", phone: "+998711234567", orders: 1, totalSpent: 4150000, lastOrder: "2026-06-04", status: "ACTIVE" },
  { id: "4", name: "Alisher Nazarov", phone: "+998901231234", orders: 3, totalSpent: 22700000, lastOrder: "2026-06-04", status: "ACTIVE" },
  { id: "5", name: "Nilufar Karimova", phone: "+998941234567", orders: 1, totalSpent: 0, lastOrder: "2026-06-04", status: "BLOCKED" },
];

const formatPrice = (n: number) => new Intl.NumberFormat("uz-UZ").format(n) + " so'm";

export default function CustomersPage() {
  return (
    <div style={{ padding: "24px" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#f5f5f5" }}>Mijozlar</h1>
        <p style={{ fontSize: "13px", color: "#6b6b6b" }}>Jami {mockCustomers.length} ta ro'yxatga olingan mijoz</p>
      </div>

      <div style={{ position: "relative", marginBottom: "20px", maxWidth: "400px" }}>
        <Search size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6b6b6b" }} />
        <input type="text" placeholder="Ism yoki telefon..." style={{ width: "100%", background: "#111111", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "9px 12px 9px 34px", color: "#f5f5f5", fontSize: "13px", outline: "none" }} />
      </div>

      <div style={{ background: "#111111", border: "1px solid #1a1a1a", borderRadius: "12px", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 80px", padding: "12px 16px", borderBottom: "1px solid #1a1a1a", background: "#0d0d0d" }}>
          {["Mijoz", "Buyurtmalar", "Jami xarid", "Oxirgi buyurtma", "Holat"].map(h => (
            <div key={h} style={{ fontSize: "11px", fontWeight: 700, color: "#4a4a4a", letterSpacing: "0.06em", textTransform: "uppercase", padding: "0 4px" }}>{h}</div>
          ))}
        </div>
        {mockCustomers.map((c, i) => (
          <div key={c.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 80px", padding: "13px 16px", borderBottom: i < mockCustomers.length - 1 ? "1px solid #0f0f0f" : "none", alignItems: "center", cursor: "pointer" }}
            onMouseEnter={e => e.currentTarget.style.background = "#161616"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <div style={{ padding: "0 4px" }}>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#f5f5f5" }}>{c.name}</div>
              <div style={{ fontSize: "11px", color: "#4a4a4a" }}>{c.phone}</div>
            </div>
            <div style={{ padding: "0 4px", fontSize: "13px", color: "#a3a3a3" }}>{c.orders} ta</div>
            <div style={{ padding: "0 4px", fontSize: "13px", fontWeight: 600, color: "#facc15" }}>{formatPrice(c.totalSpent)}</div>
            <div style={{ padding: "0 4px", fontSize: "12px", color: "#6b6b6b" }}>{c.lastOrder}</div>
            <div style={{ padding: "0 4px" }}>
              <span style={{ fontSize: "11px", fontWeight: 600, color: c.status === "ACTIVE" ? "#22c55e" : "#ef4444", background: c.status === "ACTIVE" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", padding: "2px 8px", borderRadius: "4px" }}>
                {c.status === "ACTIVE" ? "Faol" : "Bloklangan"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
