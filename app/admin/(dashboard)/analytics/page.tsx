"use client";
import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { TrendingUp, DollarSign, ShoppingCart, Percent, Download, Calendar, ArrowUpRight } from "lucide-react";

// Mock datasets for different periods
interface Metric {
  id: string;
  name: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: any;
}

interface SalePoint {
  date: string;
  sales: number;
}

interface CategoryPoint {
  name: string;
  value: number;
}

interface TopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: string;
}

interface PeriodData {
  metrics: Metric[];
  sales: SalePoint[];
  categories: CategoryPoint[];
  topProducts: TopProduct[];
}

const dataSets: Record<"7days" | "30days" | "year", PeriodData> = {
  "7days": {
    metrics: [
      { id: "metric-rev-7", name: "Jami tushum", value: "54,200,000 so'm", change: "+5.1%", isPositive: true, icon: DollarSign },
      { id: "metric-ord-7", name: "Buyurtmalar soni", value: "78 ta", change: "+12.3%", isPositive: true, icon: ShoppingCart },
      { id: "metric-aov-7", name: "O'rtacha chek", value: "694,800 so'm", change: "-6.2%", isPositive: false, icon: TrendingUp },
      { id: "metric-cr-7", name: "Konversiya", value: "3.10%", change: "+0.45%", isPositive: true, icon: Percent },
    ],
    sales: [
      { date: "Dush", sales: 7500000 },
      { date: "Sesh", sales: 8200000 },
      { date: "Chor", sales: 6900000 },
      { date: "Pay", sales: 9100000 },
      { date: "Jum", sales: 11000000 },
      { date: "Shan", sales: 12500000 },
      { date: "Yak", sales: 9000000 },
    ],
    categories: [
      { name: "Drellar", value: 40 },
      { name: "Perforatorlar", value: 20 },
      { name: "Arralar", value: 15 },
      { name: "Silliqlash", value: 15 },
      { name: "Boshqa", value: 10 },
    ],
    topProducts: [
      { id: "tp-1", name: "Bosch GSB 18V-50 Professional", sales: 12, revenue: "34,680,000 so'm" },
      { id: "tp-2", name: "Makita HR2630 Perforator", sales: 9, revenue: "17,550,000 so'm" },
      { id: "tp-3", name: "DeWalt DCD796P2 XR FlexVolt", sales: 7, revenue: "36,400,000 so'm" },
    ]
  },
  "30days": {
    metrics: [
      { id: "metric-rev-30", name: "Jami tushum", value: "256,400,000 so'm", change: "+14.2%", isPositive: true, icon: DollarSign },
      { id: "metric-ord-30", name: "Buyurtmalar soni", value: "342 ta", change: "+8.4%", isPositive: true, icon: ShoppingCart },
      { id: "metric-aov-30", name: "O'rtacha chek", value: "749,700 so'm", change: "+5.3%", isPositive: true, icon: TrendingUp },
      { id: "metric-cr-30", name: "Konversiya", value: "2.84%", change: "-0.15%", isPositive: false, icon: Percent },
    ],
    sales: [
      { date: "05-10", sales: 38000000 },
      { date: "05-15", sales: 42000000 },
      { date: "05-20", sales: 39000000 },
      { date: "05-25", sales: 55000000 },
      { date: "05-30", sales: 62000000 },
      { date: "06-04", sales: 67000000 },
    ],
    categories: [
      { name: "Drellar", value: 35 },
      { name: "Perforatorlar", value: 25 },
      { name: "Arralar", value: 20 },
      { name: "Silliqlash", value: 12 },
      { name: "Boshqa", value: 8 },
    ],
    topProducts: [
      { id: "tp-1", name: "Bosch GSB 18V-50 Professional", sales: 45, revenue: "130,050,000 so'm" },
      { id: "tp-2", name: "Milwaukee M18 FUEL 2803-20", sales: 32, revenue: "132,800,000 so'm" },
      { id: "tp-3", name: "DeWalt DCD796P2 XR FlexVolt", sales: 28, revenue: "145,600,000 so'm" },
    ]
  },
  "year": {
    metrics: [
      { id: "metric-rev-yr", name: "Jami tushum", value: "2.89 mlrd so'm", change: "+24.8%", isPositive: true, icon: DollarSign },
      { id: "metric-ord-yr", name: "Buyurtmalar soni", value: "3,890 ta", change: "+18.2%", isPositive: true, icon: ShoppingCart },
      { id: "metric-aov-yr", name: "O'rtacha chek", value: "742,900 so'm", change: "+5.6%", isPositive: true, icon: TrendingUp },
      { id: "metric-cr-yr", name: "Konversiya", value: "2.68%", change: "+0.12%", isPositive: true, icon: Percent },
    ],
    sales: [
      { date: "Yan", sales: 210000000 },
      { date: "Fev", sales: 245000000 },
      { date: "Mar", sales: 280000000 },
      { date: "Apr", sales: 310000000 },
      { date: "May", sales: 350000000 },
      { date: "Iyun", sales: 410000000 },
    ],
    categories: [
      { name: "Drellar", value: 33 },
      { name: "Perforatorlar", value: 28 },
      { name: "Arralar", value: 18 },
      { name: "Silliqlash", value: 13 },
      { name: "Boshqa", value: 8 },
    ],
    topProducts: [
      { id: "tp-1", name: "Bosch GSB 18V-50 Professional", sales: 420, revenue: "1,213,800,000 so'm" },
      { id: "tp-2", name: "Milwaukee M18 FUEL 2803-20", sales: 280, revenue: "1,162,000,000 so'm" },
      { id: "tp-3", name: "DeWalt DCD796P2 XR FlexVolt", sales: 250, revenue: "1,300,000,000 so'm" },
    ]
  }
};

const COLORS = ["#facc15", "#f59e0b", "#eab308", "#d97706", "#b45309"];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<"7days" | "30days" | "year">("30days");
  const currentData = dataSets[period];

  const handleExport = (type: string) => {
    alert(`${type.toUpperCase()} eksport fayli generatsiya qilinmoqda...`);
  };

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "28px",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 900, color: "#f5f5f5", letterSpacing: "-0.02em" }}>
            Tahlillar va Analitika
          </h1>
          <p style={{ fontSize: "13px", color: "#6b6b6b", marginTop: "2px" }}>
            Savdo ko&#39;rsatkichlari, tushum va mijozlar faolligi statistikasi
          </p>
        </div>

        {/* Date Filter Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#111111", padding: "4px", borderRadius: "10px", border: "1px solid #1a1a1a" }}>
          {[
            { key: "7days", label: "7 Kun", id: "btn-filter-7d" },
            { key: "30days", label: "30 Kun", id: "btn-filter-30d" },
            { key: "year", label: "Bu Yil", id: "btn-filter-year" },
          ].map((btn) => (
            <button
              key={btn.key}
              id={btn.id}
              onClick={() => setPeriod(btn.key as any)}
              style={{
                padding: "6px 14px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: period === btn.key ? 700 : 500,
                color: period === btn.key ? "#0a0a0a" : "#a3a3a3",
                background: period === btn.key ? "#facc15" : "transparent",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Card Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        {currentData.metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.id}
              id={m.id}
              className="stat-card"
              style={{
                background: "#111111",
                border: "1px solid #1a1a1a",
                borderRadius: "12px",
                padding: "20px",
                position: "relative",
                overflow: "hidden",
                transition: "transform 0.2s, border-color 0.2s",
                cursor: "default",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "#6b6b6b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {m.name}
                </span>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    background: "rgba(250,204,21,0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#facc15",
                  }}
                >
                  <Icon size={16} />
                </div>
              </div>

              <div style={{ marginTop: "14px" }}>
                <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#f5f5f5" }}>
                  {m.value}
                </h3>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: m.isPositive ? "#22c55e" : "#ef4444" }}>
                    {m.change}
                  </span>
                  <span style={{ fontSize: "11px", color: "#4a4a4a" }}>o&#39;tgan davrga nisbatan</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Charts and Breakdown */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px", marginBottom: "24px" }} className="charts-grid">
        {/* Sales Trend Chart */}
        <div style={{ background: "#111111", border: "1px solid #1a1a1a", borderRadius: "12px", padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "15px", fontWeight: 800, color: "#f5f5f5" }}>Savdo Grafigi (Tushum)</h2>
            <div style={{ display: "flex", gap: "6px" }}>
              <button
                id="btn-export-pdf"
                onClick={() => handleExport("pdf")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  background: "#1a1a1a",
                  border: "1px solid #2a2a2a",
                  borderRadius: "6px",
                  padding: "5px 10px",
                  color: "#a3a3a3",
                  fontSize: "11px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                <Download size={12} />
                PDF
              </button>
              <button
                id="btn-export-excel"
                onClick={() => handleExport("excel")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  background: "#1a1a1a",
                  border: "1px solid #2a2a2a",
                  borderRadius: "6px",
                  padding: "5px 10px",
                  color: "#a3a3a3",
                  fontSize: "11px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                <Download size={12} />
                Excel
              </button>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={currentData.sales}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#facc15" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#facc15" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: "#6b6b6b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fill: "#6b6b6b", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => (v >= 1000000 ? (v / 1000000).toFixed(0) + "M" : v)}
              />
              <Tooltip
                contentStyle={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "8px", color: "#f5f5f5" }}
                formatter={(v) => [new Intl.NumberFormat("uz-UZ").format(Number(v)) + " so'm", "Savdo"]}
              />
              <Area type="monotone" dataKey="sales" stroke="#facc15" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Categories Breakdown */}
        <div style={{ background: "#111111", border: "1px solid #1a1a1a", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column" }}>
          <h2 style={{ fontSize: "15px", fontWeight: 800, color: "#f5f5f5", marginBottom: "16px" }}>Kategoriya Ulushi</h2>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={currentData.categories} cx="50%" cy="50%" innerRadius={42} outerRadius={62} dataKey="value" strokeWidth={2} stroke="#111111">
                  {currentData.categories.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "8px", color: "#f5f5f5" }}
                  formatter={(v) => [`${v}%`, ""]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "12px" }}>
            {currentData.categories.map((c, i) => (
              <div key={c.name} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                <span style={{ fontSize: "11px", color: "#a3a3a3", flex: 1 }}>{c.name}</span>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#f5f5f5" }}>{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products Table */}
      <div style={{ background: "#111111", border: "1px solid #1a1a1a", borderRadius: "12px", padding: "20px" }}>
        <h2 style={{ fontSize: "15px", fontWeight: 800, color: "#f5f5f5", marginBottom: "16px" }}>
          Eng ko&#39;p sotilgan mahsulotlar
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {currentData.topProducts.map((p, index) => (
            <div
              key={p.id}
              id={p.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 14px",
                background: "#161616",
                borderRadius: "8px",
                border: "1px solid #222222",
                transition: "border-color 0.15s, transform 0.15s",
              }}
              className="top-product-row"
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "12px", fontWeight: 800, color: "#facc15", background: "rgba(250,204,21,0.08)", width: "24px", height: "24px", borderRadius: "6px", display: "flex", alignItems: "center", textAlign: "center", justifyContent: "center" }}>
                  {index + 1}
                </span>
                <div>
                  <h4 style={{ fontSize: "13px", fontWeight: 700, color: "#f5f5f5" }}>{p.name}</h4>
                  <span style={{ fontSize: "11px", color: "#6b6b6b" }}>{p.sales} dona sotilgan</span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "13px", fontWeight: 800, color: "#facc15" }}>{p.revenue}</span>
                <ArrowUpRight size={14} style={{ color: "#4a4a4a" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .stat-card:hover {
          transform: translateY(-2px);
          border-color: rgba(250, 204, 21, 0.2) !important;
        }
        .top-product-row:hover {
          border-color: rgba(250, 204, 21, 0.25) !important;
          transform: translateX(2px);
        }
        @media (max-width: 900px) {
          .charts-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
