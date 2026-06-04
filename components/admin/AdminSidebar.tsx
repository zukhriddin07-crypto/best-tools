"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Bell,
  Plus,
} from "lucide-react";

const navItems = [
  {
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    badge: null,
  },
  {
    href: "/admin/products",
    icon: Package,
    label: "Mahsulotlar",
    badge: null,
  },
  {
    href: "/admin/orders",
    icon: ShoppingBag,
    label: "Buyurtmalar",
    badge: "3",
  },
  {
    href: "/admin/customers",
    icon: Users,
    label: "Mijozlar",
    badge: null,
  },
  {
    href: "/admin/analytics",
    icon: BarChart3,
    label: "Tahlil",
    badge: null,
  },
  {
    href: "/admin/settings",
    icon: Settings,
    label: "Sozlamalar",
    badge: null,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const SidebarContent = () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "#0d0d0d",
        borderRight: "1px solid #1a1a1a",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "20px",
          borderBottom: "1px solid #1a1a1a",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          href="/admin/dashboard"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: "34px",
              height: "34px",
              background: "#facc15",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              fontSize: "18px",
              color: "#0a0a0a",
            }}
          >
            B
          </div>
          <div>
            <div
              style={{
                fontWeight: 800,
                fontSize: "14px",
                color: "#f5f5f5",
                letterSpacing: "-0.01em",
              }}
            >
              BEST <span style={{ color: "#facc15" }}>TOOLS</span>
            </div>
            <div style={{ fontSize: "10px", color: "#4a4a4a", letterSpacing: "0.05em" }}>
              ADMIN PANEL
            </div>
          </div>
        </Link>
        {/* Mobile close */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="sidebar-close-btn"
          style={{
            display: "none",
            background: "none",
            border: "none",
            color: "#6b6b6b",
            cursor: "pointer",
          }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Quick action */}
      <div style={{ padding: "12px" }}>
        <Link
          href="/admin/products/new"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "#facc15",
            color: "#0a0a0a",
            fontWeight: 700,
            padding: "10px 14px",
            borderRadius: "8px",
            fontSize: "13px",
            textDecoration: "none",
            transition: "all 0.2s",
          }}
        >
          <Plus size={16} />
          Mahsulot qo&#39;shish
        </Link>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: "8px" }}>
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin/dashboard" &&
              pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 12px",
                borderRadius: "8px",
                marginBottom: "2px",
                textDecoration: "none",
                background: isActive
                  ? "rgba(250,204,21,0.1)"
                  : "transparent",
                border: isActive
                  ? "1px solid rgba(250,204,21,0.2)"
                  : "1px solid transparent",
                color: isActive ? "#facc15" : "#6b6b6b",
                transition: "all 0.15s",
                fontSize: "14px",
                fontWeight: isActive ? 600 : 400,
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                  e.currentTarget.style.color = "#a3a3a3";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#6b6b6b";
                }
              }}
            >
              <item.icon size={16} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span
                  style={{
                    background: "#ef4444",
                    color: "white",
                    fontSize: "10px",
                    fontWeight: 700,
                    padding: "1px 6px",
                    borderRadius: "100px",
                  }}
                >
                  {item.badge}
                </span>
              )}
              {isActive && (
                <ChevronRight size={14} style={{ opacity: 0.5 }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: User info + logout */}
      <div
        style={{
          padding: "12px",
          borderTop: "1px solid #1a1a1a",
        }}
      >
        {/* View site link */}
        <Link
          href="/"
          target="_blank"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 12px",
            borderRadius: "8px",
            color: "#4a4a4a",
            fontSize: "12px",
            textDecoration: "none",
            marginBottom: "8px",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#a3a3a3";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#4a4a4a";
          }}
        >
          ↗ Saytni ko&#39;rish
        </Link>

        {/* Admin info */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 12px",
            background: "#111111",
            borderRadius: "8px",
            border: "1px solid #1a1a1a",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              background: "rgba(250,204,21,0.15)",
              border: "1px solid rgba(250,204,21,0.3)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              fontWeight: 700,
              color: "#facc15",
              flexShrink: 0,
            }}
          >
            A
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#f5f5f5",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              Super Admin
            </div>
            <div style={{ fontSize: "10px", color: "#4a4a4a" }}>
              SUPER_ADMIN
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            title="Chiqish"
            style={{
              background: "none",
              border: "none",
              color: "#4a4a4a",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#ef4444";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#4a4a4a";
            }}
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="admin-sidebar-desktop"
        style={{
          width: "220px",
          flexShrink: 0,
          height: "100vh",
          position: "sticky",
          top: 0,
          overflowY: "auto",
        }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile hamburger */}
      <button
        className="admin-menu-toggle"
        onClick={() => setIsMobileOpen(true)}
        style={{
          display: "none",
          position: "fixed",
          top: "16px",
          left: "16px",
          zIndex: 200,
          background: "#111111",
          border: "1px solid #2a2a2a",
          borderRadius: "8px",
          padding: "8px",
          color: "#f5f5f5",
          cursor: "pointer",
        }}
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 300,
            display: "flex",
          }}
        >
          <div
            style={{
              width: "240px",
              height: "100%",
              background: "#0d0d0d",
            }}
          >
            <SidebarContent />
          </div>
          <div
            style={{ flex: 1, background: "rgba(0,0,0,0.7)" }}
            onClick={() => setIsMobileOpen(false)}
          />
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar-desktop { display: none !important; }
          .admin-menu-toggle { display: flex !important; }
          .sidebar-close-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
