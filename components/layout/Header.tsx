"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingCart, User, Menu, X, ChevronDown, Phone, Zap } from "lucide-react";

const categories = [
  { name: "Drellar", nameRu: "Дрели", slug: "drills" },
  { name: "Bolg'achalar", nameRu: "Молотки и перфораторы", slug: "hammers" },
  { name: "Arra mashinalar", nameRu: "Пилы", slug: "saws" },
  { name: "Silliqlash", nameRu: "Шлифовальные машины", slug: "grinders" },
  { name: "Shurupovyortlar", nameRu: "Шуруповёрты", slug: "screwdrivers" },
  { name: "Payvandlash", nameRu: "Сварочные аппараты", slug: "welding" },
];

const brands = [
  { name: "Bosch", slug: "bosch" },
  { name: "Milwaukee", slug: "milwaukee" },
  { name: "DeWalt", slug: "dewalt" },
  { name: "Makita", slug: "makita" },
  { name: "Hilti", slug: "hilti" },
  { name: "Metabo", slug: "metabo" },
];

import { useCart } from "@/lib/cart-context";
import { useLanguage } from "@/lib/language-context";

export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  
  const { cartCount: rawCartCount, isMounted } = useCart();
  const cartCount = isMounted ? rawCartCount : 0;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  return (
    <>
      {/* Top bar */}
      <div
        style={{
          background: "#111111",
          borderBottom: "1px solid #1a1a1a",
          padding: "6px 0",
          fontSize: "12px",
          color: "#a3a3a3",
        }}
      >
        <div
          className="container-main"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Phone size={12} style={{ color: "#facc15" }} />
              <a href="tel:+998712345678" style={{ color: "#a3a3a3" }}>
                +998 71 234-56-78
              </a>
            </span>
            <span>{t("workHours")}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span
              style={{
                color: "#facc15",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <Zap size={12} />
              {t("freeDeliveryTashkent")}
            </span>
            
            {/* Language Switcher */}
            <div style={{ display: "flex", alignItems: "center", gap: "4px", marginLeft: "12px", borderLeft: "1px solid #2a2a2a", paddingLeft: "12px" }}>
              <button
                type="button"
                onClick={() => setLanguage("uz")}
                style={{
                  background: "transparent",
                  border: "none",
                  color: language === "uz" ? "#facc15" : "#6b6b6b",
                  fontWeight: language === "uz" ? 700 : 400,
                  fontSize: "11px",
                  cursor: "pointer",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  transition: "all 0.2s",
                }}
              >
                UZ
              </button>
              <span style={{ color: "#2a2a2a", fontSize: "11px" }}>|</span>
              <button
                type="button"
                onClick={() => setLanguage("ru")}
                style={{
                  background: "transparent",
                  border: "none",
                  color: language === "ru" ? "#facc15" : "#6b6b6b",
                  fontWeight: language === "ru" ? 700 : 400,
                  fontSize: "11px",
                  cursor: "pointer",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  transition: "all 0.2s",
                }}
              >
                RU
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: isScrolled
            ? "rgba(10, 10, 10, 0.95)"
            : "rgba(10, 10, 10, 1)",
          backdropFilter: isScrolled ? "blur(20px)" : "none",
          borderBottom: "1px solid #1a1a1a",
          transition: "all 0.3s ease",
          boxShadow: isScrolled ? "0 4px 24px rgba(0,0,0,0.5)" : "none",
        }}
      >
        <div
          className="container-main"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
            height: "64px",
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  background: "#facc15",
                  borderRadius: "6px",
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
                    fontSize: "16px",
                    color: "#f5f5f5",
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                  }}
                >
                  BEST{" "}
                  <span style={{ color: "#facc15" }}>TOOLS</span>
                </div>
                <div
                  style={{
                    fontSize: "9px",
                    color: "#6b6b6b",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                  }}
                >
                  {t("headerSubtitle")}
                </div>
              </div>
            </div>
          </Link>

          {/* Catalog dropdown button */}
          <div style={{ position: "relative", display: "none" }} className="desktop-only">
            <button
              onClick={() => setIsCatalogOpen(!isCatalogOpen)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "#facc15",
                color: "#0a0a0a",
                border: "none",
                borderRadius: "6px",
                padding: "8px 14px",
                fontWeight: 700,
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.2s",
                flexShrink: 0,
              }}
            >
              <Menu size={16} />
              {t("catalog")}
              <ChevronDown
                size={14}
                style={{
                  transform: isCatalogOpen ? "rotate(180deg)" : "rotate(0)",
                  transition: "transform 0.2s",
                }}
              />
            </button>

            {/* Dropdown */}
            {isCatalogOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  left: 0,
                  background: "#111111",
                  border: "1px solid #2a2a2a",
                  borderRadius: "12px",
                  padding: "12px",
                  minWidth: "220px",
                  boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
                  zIndex: 200,
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    color: "#6b6b6b",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    padding: "4px 8px",
                    marginBottom: "6px",
                  }}
                >
                  {t("categories")}
                </div>
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/catalog?category=${cat.slug}`}
                    onClick={() => setIsCatalogOpen(false)}
                    style={{
                      display: "block",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      color: "#a3a3a3",
                      fontSize: "14px",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#1a1a1a";
                      e.currentTarget.style.color = "#facc15";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#a3a3a3";
                    }}
                  >
                    {language === "ru" ? cat.nameRu : cat.name}
                  </Link>
                ))}
                <div
                  style={{
                    borderTop: "1px solid #1a1a1a",
                    margin: "10px 0",
                  }}
                />
                <div
                  style={{
                    fontSize: "11px",
                    color: "#6b6b6b",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    padding: "4px 8px",
                    marginBottom: "6px",
                  }}
                >
                  {t("brands")}
                </div>
                {brands.map((brand) => (
                  <Link
                    key={brand.slug}
                    href={`/catalog?brand=${brand.slug}`}
                    onClick={() => setIsCatalogOpen(false)}
                    style={{
                      display: "block",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      color: "#a3a3a3",
                      fontSize: "14px",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#1a1a1a";
                      e.currentTarget.style.color = "#facc15";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#a3a3a3";
                    }}
                  >
                    {brand.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Search bar */}
          <div
            style={{
              flex: 1,
              position: "relative",
              maxWidth: "480px",
            }}
          >
            <Search
              size={16}
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#6b6b6b",
                zIndex: 1,
              }}
            />
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                background: "#111111",
                border: "1px solid #2a2a2a",
                borderRadius: "8px",
                padding: "10px 12px 10px 38px",
                color: "#f5f5f5",
                fontSize: "14px",
                outline: "none",
                transition: "all 0.2s",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#facc15";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(250,204,21,0.1)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#2a2a2a";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Nav links - desktop */}
          <nav
            style={{
              display: "flex",
              gap: "4px",
              flexShrink: 0,
            }}
          >
            {/* Cart */}
            <Link
              href="/cart"
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 12px",
                borderRadius: "8px",
                color: "#a3a3a3",
                fontSize: "14px",
                transition: "all 0.2s",
                border: "1px solid transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#facc15";
                e.currentTarget.style.background = "rgba(250,204,21,0.05)";
                e.currentTarget.style.borderColor = "rgba(250,204,21,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#a3a3a3";
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "transparent";
              }}
            >
              <div style={{ position: "relative" }}>
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-6px",
                      right: "-6px",
                      background: "#facc15",
                      color: "#0a0a0a",
                      fontSize: "10px",
                      fontWeight: 700,
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hide-mobile">{t("cart")}</span>
            </Link>

            {/* Account */}
            <Link
              href="/account"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 12px",
                borderRadius: "8px",
                color: "#a3a3a3",
                fontSize: "14px",
                transition: "all 0.2s",
                border: "1px solid transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#facc15";
                e.currentTarget.style.background = "rgba(250,204,21,0.05)";
                e.currentTarget.style.borderColor = "rgba(250,204,21,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#a3a3a3";
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "transparent";
              }}
            >
              <User size={20} />
              <span className="hide-mobile">{t("login")}</span>
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              style={{
                display: "none",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
                background: "#111111",
                border: "1px solid #2a2a2a",
                borderRadius: "8px",
                color: "#f5f5f5",
                cursor: "pointer",
              }}
              className="mobile-menu-btn"
            >
              <Menu size={20} />
            </button>
          </nav>
        </div>

        {/* Desktop nav categories bar */}
        <div
          style={{
            borderTop: "1px solid #1a1a1a",
            background: "#0d0d0d",
          }}
          className="desktop-nav-bar"
        >
          <div
            className="container-main"
            style={{
              display: "flex",
              gap: "0",
              overflow: "hidden",
            }}
          >
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/catalog?category=${cat.slug}`}
                style={{
                  padding: "10px 16px",
                  fontSize: "13px",
                  color: "#a3a3a3",
                  fontWeight: 500,
                  transition: "all 0.2s",
                  whiteSpace: "nowrap",
                  borderBottom: "2px solid transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#facc15";
                  e.currentTarget.style.borderBottomColor = "#facc15";
                  e.currentTarget.style.background = "rgba(250,204,21,0.04)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#a3a3a3";
                  e.currentTarget.style.borderBottomColor = "transparent";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {language === "ru" ? cat.nameRu : cat.name}
              </Link>
            ))}
            <Link
              href="/catalog"
              style={{
                padding: "10px 16px",
                fontSize: "13px",
                color: "#facc15",
                fontWeight: 600,
                transition: "all 0.2s",
                marginLeft: "auto",
              }}
            >
              {t("allCatalog")} →
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              width: "min(320px, 90vw)",
              background: "#111111",
              borderLeft: "1px solid #2a2a2a",
              padding: "20px",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile menu header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <span
                style={{
                  fontWeight: 800,
                  fontSize: "18px",
                  color: "#f5f5f5",
                }}
              >
                BEST <span style={{ color: "#facc15" }}>TOOLS</span>
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  background: "#1a1a1a",
                  border: "1px solid #2a2a2a",
                  borderRadius: "8px",
                  width: "36px",
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#a3a3a3",
                  cursor: "pointer",
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Mobile Language Selector */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "20px", background: "#1a1a1a", padding: "6px", borderRadius: "8px" }}>
              <button
                type="button"
                onClick={() => setLanguage("uz")}
                style={{
                  flex: 1,
                  background: language === "uz" ? "#facc15" : "transparent",
                  color: language === "uz" ? "#0a0a0a" : "#a3a3a3",
                  border: "none",
                  padding: "6px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                UZ
              </button>
              <button
                type="button"
                onClick={() => setLanguage("ru")}
                style={{
                  flex: 1,
                  background: language === "ru" ? "#facc15" : "transparent",
                  color: language === "ru" ? "#0a0a0a" : "#a3a3a3",
                  border: "none",
                  padding: "6px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                RU
              </button>
            </div>

            {/* Search */}
            <div style={{ position: "relative", marginBottom: "24px" }}>
              <Search
                size={15}
                style={{
                  position: "absolute",
                  left: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#6b6b6b",
                }}
              />
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  background: "#1a1a1a",
                  border: "1px solid #2a2a2a",
                  borderRadius: "8px",
                  padding: "10px 10px 10px 34px",
                  color: "#f5f5f5",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
            </div>

            {/* Kategoriyalar */}
            <div
              style={{
                fontSize: "11px",
                color: "#6b6b6b",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "8px",
              }}
            >
              {t("categories")}
            </div>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/catalog?category=${cat.slug}`}
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  display: "block",
                  padding: "12px 0",
                  borderBottom: "1px solid #1a1a1a",
                  color: "#f5f5f5",
                  fontSize: "15px",
                }}
              >
                {language === "ru" ? cat.nameRu : cat.name}
              </Link>
            ))}

            <div style={{ height: "20px" }} />

            {/* Brendlar */}
            <div
              style={{
                fontSize: "11px",
                color: "#6b6b6b",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "8px",
              }}
            >
              {t("brands")}
            </div>
            {brands.map((brand) => (
              <Link
                key={brand.slug}
                href={`/catalog?brand=${brand.slug}`}
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  display: "block",
                  padding: "12px 0",
                  borderBottom: "1px solid #1a1a1a",
                  color: "#f5f5f5",
                  fontSize: "15px",
                }}
              >
                {brand.name}
              </Link>
            ))}

            <div style={{ height: "24px" }} />

            {/* CTA */}
            <Link
              href="/account"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                background: "#facc15",
                color: "#0a0a0a",
                fontWeight: 700,
                padding: "14px",
                borderRadius: "10px",
                fontSize: "15px",
                marginBottom: "12px",
              }}
            >
              <User size={18} />
              {t("login")}
            </Link>

            <Link
              href="/cart"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                background: "transparent",
                color: "#facc15",
                fontWeight: 600,
                padding: "14px",
                borderRadius: "10px",
                fontSize: "15px",
                border: "1px solid rgba(250,204,21,0.3)",
              }}
            >
              <ShoppingCart size={18} />
              {t("cart")}
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-only { display: block !important; }
          .mobile-menu-btn { display: none !important; }
          .desktop-nav-bar { display: block; }
          .hide-mobile { display: inline; }
        }
        @media (max-width: 767px) {
          .desktop-only { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .desktop-nav-bar { display: none; }
          .hide-mobile { display: none; }
        }
      `}</style>
    </>
  );
}
