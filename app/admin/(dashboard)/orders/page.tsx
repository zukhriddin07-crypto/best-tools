"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  Eye,
  MessageSquare,
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  Package,
  ArrowUpRight,
} from "lucide-react";
import { formatPrice } from "@/lib/mock-data";

const mockOrders = [
  {
    id: "BT-2026-0009",
    customer: { name: "Jasur Toshmatov", phone: "+998901234567" },
    items: [{ name: "Bosch GSB 18V-50", qty: 1, price: 2890000 }, { name: "Milwaukee M12", qty: 1, price: 2100000 }],
    totalAmount: 4990000,
    status: "PENDING",
    paymentStatus: "UNPAID",
    paymentMethod: "CLICK",
    deliveryMethod: "BTS_EXPRESS",
    deliveryAddress: { region: "Toshkent", city: "Toshkent", street: "Mustaqillik ko'chasi", house: "10" },
    createdAt: "2026-06-04T10:02:00Z",
    note: "",
  },
  {
    id: "BT-2026-0008",
    customer: { name: "Sherzod Yusupov", phone: "+998931234567" },
    items: [{ name: "Bosch GSB 18V-50", qty: 1, price: 2890000 }],
    totalAmount: 2890000,
    status: "CONFIRMED",
    paymentStatus: "PAID",
    paymentMethod: "PAYME",
    deliveryMethod: "PICKUP",
    deliveryAddress: { region: "Toshkent", city: "Toshkent", street: "Do'kon", house: "1" },
    createdAt: "2026-06-04T09:44:00Z",
    note: "Tezroq yetkazing",
  },
  {
    id: "BT-2026-0007",
    customer: { name: "Dildora Xasanova", phone: "+998711234567" },
    items: [{ name: "Milwaukee M18 FUEL", qty: 1, price: 4150000 }],
    totalAmount: 4150000,
    status: "SHIPPED",
    paymentStatus: "PAID",
    paymentMethod: "CLICK",
    deliveryMethod: "BTS_EXPRESS",
    deliveryAddress: { region: "Samarqand", city: "Samarqand", street: "Registon ko'cha", house: "5" },
    createdAt: "2026-06-04T09:02:00Z",
    note: "",
  },
  {
    id: "BT-2026-0006",
    customer: { name: "Alisher Nazarov", phone: "+998901231234" },
    items: [{ name: "Hilti TE 30-A36", qty: 1, price: 8900000 }],
    totalAmount: 8900000,
    status: "DELIVERED",
    paymentStatus: "PAID",
    paymentMethod: "UZUM_NASIYA",
    deliveryMethod: "YANDEX_DELIVERY",
    deliveryAddress: { region: "Toshkent", city: "Toshkent", street: "Yunusobod", house: "12" },
    createdAt: "2026-06-04T07:02:00Z",
    note: "",
  },
  {
    id: "BT-2026-0005",
    customer: { name: "Nilufar Karimova", phone: "+998941234567" },
    items: [{ name: "Makita HR2630", qty: 1, price: 1950000 }],
    totalAmount: 1950000,
    status: "CANCELLED",
    paymentStatus: "REFUNDED",
    paymentMethod: "CASH_ON_DELIVERY",
    deliveryMethod: "BTS_EXPRESS",
    deliveryAddress: { region: "Toshkent", city: "Toshkent", street: "Chilonzor", house: "8" },
    createdAt: "2026-06-04T05:02:00Z",
    note: "Bekor qilindi — mijoz rad etdi",
  },
];

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  PENDING: { label: "Yangi", color: "#f59e0b", bg: "rgba(245,158,11,0.1)", icon: Clock },
  CONFIRMED: { label: "Tasdiqlangan", color: "#3b82f6", bg: "rgba(59,130,246,0.1)", icon: CheckCircle },
  PROCESSING: { label: "Tayyorlanmoqda", color: "#8b5cf6", bg: "rgba(139,92,246,0.1)", icon: Package },
  SHIPPED: { label: "Jo'natildi", color: "#06b6d4", bg: "rgba(6,182,212,0.1)", icon: Truck },
  DELIVERED: { label: "Yetkazildi", color: "#22c55e", bg: "rgba(34,197,94,0.1)", icon: CheckCircle },
  CANCELLED: { label: "Bekor", color: "#ef4444", bg: "rgba(239,68,68,0.1)", icon: XCircle },
  RETURNED: { label: "Qaytarildi", color: "#f97316", bg: "rgba(249,115,22,0.1)", icon: XCircle },
};

const paymentConfig: Record<string, { label: string; color: string }> = {
  UNPAID: { label: "To'lanmagan", color: "#ef4444" },
  PAID: { label: "To'langan", color: "#22c55e" },
  PARTIAL: { label: "Qisman", color: "#f59e0b" },
  REFUNDED: { label: "Qaytarilgan", color: "#6b6b6b" },
};

const paymentMethodLabel: Record<string, string> = {
  CLICK: "Click",
  PAYME: "Payme",
  UZUM_NASIYA: "Uzum Nasiya",
  CASH_ON_DELIVERY: "Naqd",
};

const deliveryMethodLabel: Record<string, string> = {
  BTS_EXPRESS: "BTS Express",
  YANDEX_DELIVERY: "Yandex",
  PICKUP: "O'zi oladi",
};

const nextStatuses: Record<string, string[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: ["RETURNED"],
  CANCELLED: [],
  RETURNED: [],
};

export default function OrdersPage() {
  const [orders, setOrders] = useState(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<typeof mockOrders[0] | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = orders.filter((o) => {
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    const matchSearch =
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const updateStatus = (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    if (selectedOrder?.id === orderId) {
      setSelectedOrder((prev) => prev ? { ...prev, status: newStatus } : null);
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#f5f5f5" }}>Buyurtmalar</h1>
          <p style={{ fontSize: "13px", color: "#6b6b6b" }}>Jami {orders.length} ta buyurtma</p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
          <Search size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6b6b6b" }} />
          <input
            type="text"
            placeholder="Buyurtma raqami yoki mijoz nomi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "100%", background: "#111111", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "9px 12px 9px 34px", color: "#f5f5f5", fontSize: "13px", outline: "none" }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ background: "#111111", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "9px 14px", color: "#f5f5f5", fontSize: "13px", outline: "none", cursor: "pointer" }}
        >
          <option value="all">Barcha holat</option>
          {Object.entries(statusConfig).map(([key, { label }]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {/* Table + Detail panel */}
      <div style={{ display: "grid", gridTemplateColumns: selectedOrder ? "1fr 380px" : "1fr", gap: "16px" }} className="orders-grid">
        {/* Orders table */}
        <div style={{ background: "#111111", border: "1px solid #1a1a1a", borderRadius: "12px", overflow: "hidden" }}>
          {/* Table head */}
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 0.8fr 0.8fr", padding: "12px 16px", borderBottom: "1px solid #1a1a1a", background: "#0d0d0d" }}>
            {["Buyurtma", "Mijoz", "Summa", "To'lov", "Holat"].map((h) => (
              <div key={h} style={{ fontSize: "11px", fontWeight: 700, color: "#4a4a4a", letterSpacing: "0.06em", textTransform: "uppercase", padding: "0 4px" }}>{h}</div>
            ))}
          </div>

          {filtered.map((order, i) => {
            const st = statusConfig[order.status] || statusConfig.PENDING;
            const StatusIcon = st.icon;
            const pay = paymentConfig[order.paymentStatus] || paymentConfig.UNPAID;
            const isSelected = selectedOrder?.id === order.id;

            return (
              <div
                key={order.id}
                onClick={() => setSelectedOrder(isSelected ? null : order)}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.5fr 1fr 1fr 0.8fr 0.8fr",
                  padding: "13px 16px",
                  borderBottom: i < filtered.length - 1 ? "1px solid #0f0f0f" : "none",
                  alignItems: "center",
                  cursor: "pointer",
                  background: isSelected ? "rgba(250,204,21,0.04)" : "transparent",
                  borderLeft: isSelected ? "2px solid #facc15" : "2px solid transparent",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = "#161616"; }}
                onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
              >
                <div style={{ padding: "0 4px" }}>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#facc15", fontVariantNumeric: "tabular-nums" }}>{order.id}</div>
                  <div style={{ fontSize: "11px", color: "#4a4a4a" }}>
                    {new Date(order.createdAt).toLocaleDateString("uz-UZ")}
                  </div>
                </div>
                <div style={{ padding: "0 4px" }}>
                  <div style={{ fontSize: "13px", color: "#f5f5f5", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{order.customer.name}</div>
                  <div style={{ fontSize: "11px", color: "#4a4a4a" }}>{order.customer.phone}</div>
                </div>
                <div style={{ padding: "0 4px" }}>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#f5f5f5", fontVariantNumeric: "tabular-nums" }}>
                    {formatPrice(order.totalAmount)}
                  </div>
                  <div style={{ fontSize: "11px", color: "#4a4a4a" }}>{paymentMethodLabel[order.paymentMethod]}</div>
                </div>
                <div style={{ padding: "0 4px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 600, color: pay.color, background: `${pay.color}15`, padding: "2px 6px", borderRadius: "4px" }}>
                    {pay.label}
                  </span>
                </div>
                <div style={{ padding: "0 4px" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: 600, color: st.color, background: st.bg, padding: "3px 8px", borderRadius: "4px", width: "fit-content" }}>
                    <StatusIcon size={10} />
                    {st.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order detail panel */}
        {selectedOrder && (
          <div style={{ background: "#111111", border: "1px solid #1a1a1a", borderRadius: "12px", overflow: "hidden", maxHeight: "calc(100vh - 160px)", overflowY: "auto" }}>
            {/* Header */}
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #1a1a1a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "15px", fontWeight: 800, color: "#facc15" }}>{selectedOrder.id}</div>
                <div style={{ fontSize: "12px", color: "#6b6b6b" }}>
                  {new Date(selectedOrder.createdAt).toLocaleString("uz-UZ")}
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                style={{ background: "none", border: "none", color: "#6b6b6b", cursor: "pointer", fontSize: "18px" }}
              >✕</button>
            </div>

            <div style={{ padding: "16px 20px" }}>
              {/* Customer */}
              <div style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#4a4a4a", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>Mijoz</div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "#f5f5f5" }}>{selectedOrder.customer.name}</div>
                <div style={{ fontSize: "13px", color: "#6b6b6b" }}>{selectedOrder.customer.phone}</div>
              </div>

              {/* Items */}
              <div style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#4a4a4a", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>Mahsulotlar</div>
                {selectedOrder.items.map((item, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #0f0f0f" }}>
                    <span style={{ fontSize: "13px", color: "#a3a3a3" }}>{item.name} × {item.qty}</span>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#f5f5f5" }}>{formatPrice(item.price)}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0 0" }}>
                  <span style={{ fontWeight: 700, color: "#f5f5f5" }}>Jami</span>
                  <span style={{ fontWeight: 800, color: "#facc15", fontSize: "16px" }}>{formatPrice(selectedOrder.totalAmount)}</span>
                </div>
              </div>

              {/* Delivery */}
              <div style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#4a4a4a", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>Yetkazib berish</div>
                <div style={{ fontSize: "13px", color: "#a3a3a3", marginBottom: "4px" }}>{deliveryMethodLabel[selectedOrder.deliveryMethod]}</div>
                <div style={{ fontSize: "13px", color: "#6b6b6b" }}>
                  {selectedOrder.deliveryAddress.region}, {selectedOrder.deliveryAddress.city},
                  {" "}{selectedOrder.deliveryAddress.street}, {selectedOrder.deliveryAddress.house}
                </div>
              </div>

              {/* Note */}
              {selectedOrder.note && (
                <div style={{ marginBottom: "16px", padding: "10px 12px", background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.15)", borderRadius: "8px" }}>
                  <div style={{ fontSize: "11px", color: "#f59e0b", fontWeight: 600, marginBottom: "4px" }}>Izoh</div>
                  <div style={{ fontSize: "12px", color: "#a3a3a3" }}>{selectedOrder.note}</div>
                </div>
              )}

              {/* Status change */}
              <div style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#4a4a4a", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>Holatni o&#39;zgartirish</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {nextStatuses[selectedOrder.status]?.map((next) => {
                    const cfg = statusConfig[next];
                    return (
                      <button
                        key={next}
                        onClick={() => updateStatus(selectedOrder.id, next)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "10px 14px",
                          background: cfg.bg,
                          border: `1px solid ${cfg.color}30`,
                          borderRadius: "8px",
                          color: cfg.color,
                          fontWeight: 600,
                          fontSize: "13px",
                          cursor: "pointer",
                          transition: "all 0.15s",
                        }}
                      >
                        <cfg.icon size={14} />
                        {cfg.label} qilish
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <button style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "8px", color: "#a3a3a3", fontSize: "13px", cursor: "pointer" }}>
                  <MessageSquare size={14} />
                  SMS yuborish
                </button>
                <button style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "8px", color: "#a3a3a3", fontSize: "13px", cursor: "pointer" }}>
                  <Truck size={14} />
                  BTS jo&#39;natma yaratish
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .orders-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
