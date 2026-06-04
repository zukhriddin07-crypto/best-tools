"use client";

import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  PlayCircle,
  ArrowRight,
} from "lucide-react";
import { useLanguage } from "@/lib/language-context";

const footerCategories = [
  { name: "Drellar", nameRu: "Дрели", slug: "drills" },
  { name: "Bolg'achalar", nameRu: "Молотки и перфораторы", slug: "hammers" },
  { name: "Arra mashinalar", nameRu: "Пилы", slug: "saws" },
  { name: "Silliqlash", nameRu: "Шлифовальные машины", slug: "grinders" },
  { name: "Shurupovyortlar", nameRu: "Шуруповёрты", slug: "screwdrivers" },
  { name: "Payvandlash", nameRu: "Сварочные аппараты", slug: "welding" },
];

const footerBrands = [
  { name: "Bosch", slug: "bosch" },
  { name: "Milwaukee", slug: "milwaukee" },
  { name: "DeWalt", slug: "dewalt" },
  { name: "Makita", slug: "makita" },
  { name: "Hilti", slug: "hilti" },
  { name: "Metabo", slug: "metabo" },
];

const footerLinks = [
  { name: "Biz haqimizda", nameRu: "О нас", href: "/about" },
  { name: "Yetkazib berish", nameRu: "Доставка", href: "/delivery" },
  { name: "Kafolat", nameRu: "Гарантия", href: "/warranty" },
  { name: "Qaytarish siyosati", nameRu: "Политика возврата", href: "/returns" },
  { name: "Maxfiylik siyosati", nameRu: "Политика конфиденциальности", href: "/privacy" },
  { name: "Foydalanish shartlari", nameRu: "Условия использования", href: "/terms" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { language, t } = useLanguage();

  return (
    <footer
      style={{
        background: "#080808",
        borderTop: "1px solid #1a1a1a",
        marginTop: "80px",
      }}
    >
      {/* Newsletter bar */}
      <div
        style={{
          background: "linear-gradient(135deg, #1a1505 0%, #0f0e04 100%)",
          borderBottom: "1px solid rgba(250,204,21,0.1)",
          padding: "40px 0",
        }}
      >
        <div className="container-main">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <h3
              style={{
                fontSize: "22px",
                fontWeight: 800,
                color: "#f5f5f5",
              }}
            >
              {language === "ru" ? (
                <>
                  Будьте в курсе новинок и <span style={{ color: "#facc15" }}>акций</span>
                </>
              ) : (
                <>
                  Yangi mahsulotlar va aksiyalardan <span style={{ color: "#facc15" }}>xabardor bo&#39;ling</span>
                </>
              )}
            </h3>
            <p style={{ color: "#6b6b6b", fontSize: "14px" }}>
              {language === "ru"
                ? "Присоединяйтесь к нашему Telegram-каналу — новые предложения каждый день"
                : "Telegram kanalimizga qo'shiling — har kuni yangi takliflar"}
            </p>
            <a
              href="https://t.me/besttoolsuz"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "#facc15",
                color: "#0a0a0a",
                fontWeight: 700,
                padding: "12px 24px",
                borderRadius: "8px",
                fontSize: "14px",
                transition: "all 0.2s",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#eab308";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 0 20px rgba(250,204,21,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#facc15";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <Send size={16} />
              {language === "ru" ? "Присоединиться к Telegram" : "Telegram kanalga qo'shilish"}
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div style={{ padding: "60px 0 40px" }}>
        <div className="container-main">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "40px",
            }}
          >
            {/* Brand column */}
            <div style={{ gridColumn: "span 1" }}>
              <div style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      background: "#facc15",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 900,
                      fontSize: "20px",
                      color: "#0a0a0a",
                    }}
                  >
                    B
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: 800,
                        fontSize: "18px",
                        color: "#f5f5f5",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      BEST <span style={{ color: "#facc15" }}>TOOLS</span>
                    </div>
                  </div>
                </div>
                <p
                  style={{
                    color: "#6b6b6b",
                    fontSize: "13px",
                    lineHeight: 1.7,
                    maxWidth: "220px",
                  }}
                >
                  {t("footerDesc")}
                </p>
              </div>

              {/* Social links */}
              <div style={{ display: "flex", gap: "8px" }}>
                {[
                  { icon: Send, href: "https://t.me/besttoolsuz", label: "Telegram" },
                  { icon: MessageCircle, href: "https://instagram.com/besttoolsuz", label: "Instagram" },
                  { icon: PlayCircle, href: "https://youtube.com/@besttoolsuz", label: "YouTube" },
                ].map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={label}
                    style={{
                      width: "36px",
                      height: "36px",
                      background: "#111111",
                      border: "1px solid #2a2a2a",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#a3a3a3",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(250,204,21,0.1)";
                      e.currentTarget.style.borderColor = "rgba(250,204,21,0.4)";
                      e.currentTarget.style.color = "#facc15";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#111111";
                      e.currentTarget.style.borderColor = "#2a2a2a";
                      e.currentTarget.style.color = "#a3a3a3";
                    }}
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <h4
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#6b6b6b",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: "16px",
                }}
              >
                {t("categories")}
              </h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
                {footerCategories.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={`/catalog?category=${cat.slug}`}
                      style={{
                        color: "#a3a3a3",
                        fontSize: "14px",
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = "#facc15"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = "#a3a3a3"; }}
                    >
                      {language === "ru" ? cat.nameRu : cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Brands */}
            <div>
              <h4
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#6b6b6b",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: "16px",
                }}
              >
                {t("brands")}
              </h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
                {footerBrands.map((brand) => (
                  <li key={brand.slug}>
                    <Link
                      href={`/catalog?brand=${brand.slug}`}
                      style={{
                        color: "#a3a3a3",
                        fontSize: "14px",
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = "#facc15"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = "#a3a3a3"; }}
                    >
                      {brand.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contacts */}
            <div>
              <h4
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#6b6b6b",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: "16px",
                }}
              >
                {t("contact")}
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <a
                  href="tel:+998712345678"
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                    color: "#a3a3a3",
                    fontSize: "13px",
                    transition: "color 0.2s",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#facc15"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#a3a3a3"; }}
                >
                  <Phone size={15} style={{ marginTop: "1px", flexShrink: 0, color: "#facc15" }} />
                  +998 71 234-56-78
                </a>
                <a
                  href="mailto:info@besttools.uz"
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                    color: "#a3a3a3",
                    fontSize: "13px",
                    transition: "color 0.2s",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#facc15"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#a3a3a3"; }}
                >
                  <Mail size={15} style={{ marginTop: "1px", flexShrink: 0, color: "#facc15" }} />
                  info@besttools.uz
                </a>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", color: "#a3a3a3", fontSize: "13px" }}>
                  <MapPin size={15} style={{ marginTop: "1px", flexShrink: 0, color: "#facc15" }} />
                  {language === "ru" ? (
                    <>
                      г. Ташкент, Чиланзарский район,
                      <br />ул. Мустакиллик 1
                    </>
                  ) : (
                    <>
                      Toshkent sh., Chilonzor tumani,
                      <br />Mustaqillik ko&#39;chasi 1
                    </>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", color: "#a3a3a3", fontSize: "13px" }}>
                  <Clock size={15} style={{ marginTop: "1px", flexShrink: 0, color: "#facc15" }} />
                  {language === "ru" ? (
                    <>
                      Пн–Сб: 9:00–18:00
                      <br />Вс: Выходной
                    </>
                  ) : (
                    <>
                      Du–Sha: 9:00–18:00
                      <br />Yak: Dam olish
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          borderTop: "1px solid #111111",
          padding: "20px 0",
        }}
      >
        <div
          className="container-main"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "16px",
              justifyContent: "center",
            }}
          >
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  color: "#4a4a4a",
                  fontSize: "12px",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#a3a3a3"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#4a4a4a"; }}
              >
                {language === "ru" ? link.nameRu : link.name}
              </Link>
            ))}
          </div>
          <p
            style={{
              textAlign: "center",
              color: "#3a3a3a",
              fontSize: "12px",
            }}
          >
            © {currentYear} Best Tools. {t("rightsReserved")}
            <span style={{ margin: "0 8px", color: "#2a2a2a" }}>|</span>
            <span style={{ color: "#4a4a4a" }}>
              {language === "ru"
                ? "Bosch, Milwaukee, DeWalt, Makita — в Узбекистане"
                : "Bosch, Milwaukee, DeWalt, Makita — O'zbekistonda"}
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
