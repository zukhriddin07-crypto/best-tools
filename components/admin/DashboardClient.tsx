"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  TrendingUp,
  ShoppingBag,
  Package,
  Users,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

// Mock dashboard data
const salesData = [
  { day: "May 5", sales: 4200000, orders: 3 },
  { day: "May 10", sales: 6800000, orders: 5 },
  { day: "May 15", sales: 3900000, orders: 2 },
  { day: "May 20", sales: 9200000, orders: 7 },
  { day: "May 25", sales: 7400000, orders: 4 },
  { day: "May 30", sales: 11200000, orders: 8 },
  { day: "Iyu 1", sales: 8900000, orders: 6 },
  { day: "Iyu 4", sales: 13500000, orders: 9 },
];

const topProducts = [
  { name: "Bosch GSB 18V-50", sales: 12, revenue: 34680000 },
  { name: "Milwaukee M18 FUEL", sales: 8, revenue: 33200000 },
  { name: "DeWalt DCS391P1", sales: 6, revenue: 22500000 },
  { name: "Hilti TE 30-A36", sales: 3, revenue: 26700000 },
  { name: "Makita HR2630", sales: 14, revenue: 27300000 },
];

const recentOrders = [
  {
    id: "BT-2026-0009",
    customer: "Jasur Toshmatov",
    amount: 5800000,
    status: "PENDING",
    time: "2 daqiqa oldin",
  },
  {
    id: "BT-2026-0008",
    customer: "Sherzod Yusupov",
    amount: 2890000,
    status: "CONFIRMED",
    time: "18 daqiqa oldin",
  },
  {
    id: "BT-2026-0007",
    customer: "Dildora Xasanova",
    amount: 4150000,
    status: "SHIPPED",
    time: "1 soat oldin",
  },
  {
    id: "BT-2026-0006",
    customer: "Alisher Nazarov",
    amount: 8900000,
    status: "DELIVERED",
    time: "3 soat oldin",
  },
  {
    id: "BT-2026-0005",
    customer: "Nilufar Karimova",
    amount: 1950000,
    status: "CANCELLED",
    time: "5 soat oldin",
  },
];

const lowStockProducts = [
  { name: "Hilti TE 30-A36", stock: 3 },
  { name: "DeWalt DCD796P2", stock: 5 },
  { name: "Milwaukee M18 FUEL", stock: 8 },
];

const statusConfig: Record<
  string,
  { label: string; color: string; bg: string; icon: React.ElementType }
> = {
  PENDING: { label: "Yangi", color: "#f59e0b", bg: "rgba(245,158,11,0.1)", icon: Clock },
  CONFIRMED: { label: "Tasdiqlangan", color: "#3b82f6", bg: "rgba(59,130,246,0.1)", icon: CheckCircle },
  PROCESSING: { label: "Tayyorlanmoqda", color: "#8b5cf6", bg: "rgba(139,92,246,0.1)", icon: Package },
  SHIPPED: { label: "Jo'natildi", color: "#06b6d4", bg: "rgba(6,182,212,0.1)", icon: ArrowUpRight },
  DELIVERED: { label: "Yetkazildi", color: "#22c55e", bg: "rgba(34,197,94,0.1)", icon: CheckCircle },
  CANCELLED: { label: "Bekor", color: "#ef4444", bg: "rgba(239,68,68,0.1)", icon: XCircle },
};

const formatPrice = (n: number) =>
  new Intl.NumberFormat("uz-UZ").format(n) + " so'm";

function StatCard({
  title,
  value,
  change,
  positive,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div
      style={{
        background: "#111111",
        border: "1px solid #1a1a1a",
        borderRadius: "12px",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            background: color + "15",
            border: `1px solid ${color}30`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={18} style={{ color }} />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "12px",
            color: positive ? "#22c55e" : "#ef4444",
            fontWeight: 600,
          }}
        >
          {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {change}
        </div>
      </div>
      <div
        style={{
          fontSize: "24px",
          fontWeight: 800,
          color: "#f5f5f5",
          marginBottom: "4px",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: "13px", color: "#6b6b6b" }}>{title}</div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "#1a1a1a",
          border: "1px solid #2a2a2a",
          borderRadius: "8px",
          padding: "10px 14px",
          fontSize: "13px",
        }}
      >
        <p style={{ color: "#6b6b6b", marginBottom: "4px" }}>{label}</p>
        <p style={{ color: "#facc15", fontWeight: 700 }}>
          {formatPrice(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export default function DashboardClient() {
  return (
    <div style={{ padding: "24px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "28px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#f5f5f5" }}>
            Dashboard
          </h1>
          <p style={{ fontSize: "13px", color: "#6b6b6b", marginTop: "2px" }}>
            Oxirgi 30 kun tahlili
          </p>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "#111111",
            border: "1px solid #1a1a1a",
            borderRadius: "8px",
            padding: "8px 14px",
            fontSize: "13px",
            color: "#a3a3a3",
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#22c55e",
              display: "inline-block",
            }}
          />
          Jonli ma&#39;lumot
        </div>
      </div>

      {/* Stats grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <StatCard
          title="Bugungi sotuvlar"
          value="13 500 000 so'm"
          change="+24%"
          positive={true}
          icon={TrendingUp}
          color="#facc15"
        />
        <StatCard
          title="Yangi buyurtmalar"
          value="9"
          change="+12%"
          positive={true}
          icon={ShoppingBag}
          color="#3b82f6"
        />
        <StatCard
          title="Faol mahsulotlar"
          value="1 487"
          change="+3%"
          positive={true}
          icon={Package}
          color="#22c55e"
        />
        <StatCard
          title="Jami mijozlar"
          value="8 542"
          change="+8%"
          positive={true}
          icon={Users}
          color="#8b5cf6"
        />
      </div>

      {/* Charts row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "16px",
          marginBottom: "24px",
        }}
        className="dashboard-charts"
      >
        {/* Sales chart */}
        <div
          style={{
            background: "#111111",
            border: "1px solid #1a1a1a",
            borderRadius: "12px",
            padding: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <div>
              <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#f5f5f5" }}>
                Sotuvlar grafigi
              </h2>
              <p style={{ fontSize: "12px", color: "#6b6b6b" }}>
                Oxirgi 30 kun
              </p>
            </div>
            <span
              style={{
                background: "rgba(250,204,21,0.1)",
                color: "#facc15",
                fontSize: "12px",
                fontWeight: 700,
                padding: "4px 10px",
                borderRadius: "6px",
              }}
            >
              +34% o&#39;sish
            </span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#facc15" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#facc15" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
              <XAxis
                dataKey="day"
                tick={{ fill: "#6b6b6b", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#6b6b6b", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => (v / 1000000).toFixed(0) + "M"}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#facc15"
                strokeWidth={2}
                fill="url(#salesGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top products */}
        <div
          style={{
            background: "#111111",
            border: "1px solid #1a1a1a",
            borderRadius: "12px",
            padding: "20px",
          }}
        >
          <h2
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: "#f5f5f5",
              marginBottom: "16px",
            }}
          >
            Top 5 mahsulot
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {topProducts.map((p, i) => (
              <div key={p.name}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "4px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#a3a3a3",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: "140px",
                    }}
                  >
                    {p.name}
                  </span>
                  <span style={{ fontSize: "12px", color: "#6b6b6b" }}>
                    {p.sales} ta
                  </span>
                </div>
                <div
                  style={{
                    height: "4px",
                    background: "#1a1a1a",
                    borderRadius: "2px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${(p.sales / 14) * 100}%`,
                      background:
                        i === 0 ? "#facc15" : i === 1 ? "#f59e0b" : "#2a2a2a",
                      borderRadius: "2px",
                      transition: "width 1s ease",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row: Recent orders + Low stock */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "16px",
        }}
        className="dashboard-bottom"
      >
        {/* Recent orders */}
        <div
          style={{
            background: "#111111",
            border: "1px solid #1a1a1a",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid #1a1a1a",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#f5f5f5" }}>
              Oxirgi buyurtmalar
            </h2>
            <a
              href="/admin/orders"
              style={{ fontSize: "12px", color: "#facc15" }}
            >
              Barchasini ko&#39;rish →
            </a>
          </div>
          <div>
            {recentOrders.map((order, i) => {
              const st = statusConfig[order.status] || statusConfig.PENDING;
              const StatusIcon = st.icon;
              return (
                <div
                  key={order.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "14px 20px",
                    borderBottom:
                      i < recentOrders.length - 1 ? "1px solid #0f0f0f" : "none",
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
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      background: st.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <StatusIcon size={14} style={{ color: st.color }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
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
                      {order.customer}
                    </div>
                    <div style={{ fontSize: "11px", color: "#4a4a4a" }}>
                      {order.id} · {order.time}
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 700,
                        color: "#f5f5f5",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {formatPrice(order.amount)}
                    </div>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 600,
                        color: st.color,
                        background: st.bg,
                        padding: "1px 6px",
                        borderRadius: "4px",
                      }}
                    >
                      {st.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Low stock alert */}
        <div
          style={{
            background: "#111111",
            border: "1px solid #1a1a1a",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid #1a1a1a",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <AlertTriangle size={15} style={{ color: "#f59e0b" }} />
            <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#f5f5f5" }}>
              Kam zaxira
            </h2>
          </div>
          <div style={{ padding: "12px" }}>
            {lowStockProducts.map((p) => (
              <div
                key={p.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px",
                  background: "rgba(245,158,11,0.04)",
                  border: "1px solid rgba(245,158,11,0.12)",
                  borderRadius: "8px",
                  marginBottom: "8px",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    color: "#a3a3a3",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: "130px",
                  }}
                >
                  {p.name}
                </span>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: p.stock <= 3 ? "#ef4444" : "#f59e0b",
                    background:
                      p.stock <= 3
                        ? "rgba(239,68,68,0.1)"
                        : "rgba(245,158,11,0.1)",
                    padding: "2px 8px",
                    borderRadius: "4px",
                  }}
                >
                  {p.stock} ta
                </span>
              </div>
            ))}

            <a
              href="/admin/products"
              style={{
                display: "block",
                textAlign: "center",
                padding: "10px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid #1a1a1a",
                borderRadius: "8px",
                fontSize: "12px",
                color: "#6b6b6b",
                textDecoration: "none",
                marginTop: "4px",
                transition: "all 0.15s",
              }}
            >
              Mahsulotlarga o&#39;tish →
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .dashboard-charts, .dashboard-bottom {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
