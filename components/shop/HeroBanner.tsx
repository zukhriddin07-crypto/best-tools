"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Shield, Truck, Clock, Award } from "lucide-react";

export default function HeroBanner() {
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const counters = statsRef.current?.querySelectorAll("[data-count]");
    counters?.forEach((counter) => {
      const target = parseInt(counter.getAttribute("data-count") || "0");
      let current = 0;
      const increment = target / 60;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        counter.textContent = Math.floor(current).toLocaleString();
      }, 20);
    });
  }, []);

  return (
    <section
      style={{
        position: "relative",
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: "linear-gradient(135deg, #0a0a0a 0%, #0f0e04 50%, #0a0a0a 100%)",
      }}
    >
      {/* Background image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
        }}
      >
        <Image
          src="/hero-banner.png"
          alt="Best Tools — Professional asboblar"
          fill
          style={{ objectFit: "cover", opacity: 0.25 }}
          priority
        />
        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to right, rgba(10,10,10,0.98) 40%, rgba(10,10,10,0.5) 100%)",
          }}
        />
      </div>

      {/* Industrial grid pattern */}
      <div
        className="bg-grid-pattern"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
        }}
      />

      {/* Yellow accent glow */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          right: "10%",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(250,204,21,0.08) 0%, transparent 70%)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      <div
        className="container-main"
        style={{
          position: "relative",
          zIndex: 2,
          paddingTop: "60px",
          paddingBottom: "60px",
        }}
      >
        <div style={{ maxWidth: "680px" }}>
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(250,204,21,0.1)",
              border: "1px solid rgba(250,204,21,0.3)",
              borderRadius: "100px",
              padding: "6px 14px",
              marginBottom: "24px",
              animation: "fadeInUp 0.6s ease",
            }}
          >
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#facc15",
                animation: "pulseGlow 2s infinite",
              }}
            />
            <span
              style={{
                color: "#facc15",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.05em",
              }}
            >
              O&#39;zbekistonda №1 professional asboblar
            </span>
          </div>

          {/* Main heading */}
          <h1
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              fontWeight: 900,
              lineHeight: 1.05,
              color: "#f5f5f5",
              marginBottom: "20px",
              letterSpacing: "-0.03em",
              animation: "fadeInUp 0.7s ease 0.1s both",
            }}
          >
            Professional
            <br />
            <span className="text-gradient">Elektr Asboblar</span>
            <br />
            <span style={{ color: "#a3a3a3", fontWeight: 400, fontSize: "0.7em" }}>
              Eng yaxshi brendlar
            </span>
          </h1>

          <p
            style={{
              color: "#6b6b6b",
              fontSize: "clamp(14px, 2vw, 17px)",
              lineHeight: 1.7,
              maxWidth: "500px",
              marginBottom: "36px",
              animation: "fadeInUp 0.7s ease 0.2s both",
            }}
          >
            Bosch, Milwaukee, DeWalt, Makita va boshqa premium brendlar.
            Bo&#39;lib to&#39;lash, tez yetkazib berish va 1 yil kafolat bilan.
          </p>

          {/* CTA buttons */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              marginBottom: "48px",
              animation: "fadeInUp 0.7s ease 0.3s both",
            }}
          >
            <Link
              href="/catalog"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "#facc15",
                color: "#0a0a0a",
                fontWeight: 700,
                padding: "14px 28px",
                borderRadius: "10px",
                fontSize: "15px",
                transition: "all 0.2s",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#eab308";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 0 30px rgba(250,204,21,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#facc15";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Katalogni ko&#39;rish
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/catalog?sale=true"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "transparent",
                color: "#f5f5f5",
                fontWeight: 600,
                padding: "14px 28px",
                borderRadius: "10px",
                fontSize: "15px",
                transition: "all 0.2s",
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(250,204,21,0.4)";
                e.currentTarget.style.color = "#facc15";
                e.currentTarget.style.background = "rgba(250,204,21,0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                e.currentTarget.style.color = "#f5f5f5";
                e.currentTarget.style.background = "transparent";
              }}
            >
              Aksiyalar
            </Link>
          </div>

          {/* Stats */}
          <div
            ref={statsRef}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "24px",
              maxWidth: "400px",
              animation: "fadeInUp 0.7s ease 0.4s both",
            }}
          >
            {[
              { count: "1500", suffix: "+", label: "Mahsulot" },
              { count: "8500", suffix: "+", label: "Mijoz" },
              { count: "6", suffix: "", label: "Premium brend" },
            ].map((stat) => (
              <div key={stat.label}>
                <div
                  style={{
                    fontSize: "28px",
                    fontWeight: 800,
                    color: "#facc15",
                    fontVariantNumeric: "tabular-nums",
                    lineHeight: 1,
                  }}
                >
                  <span data-count={stat.count}>0</span>
                  {stat.suffix}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#6b6b6b",
                    marginTop: "4px",
                    fontWeight: 500,
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust badges — bottom bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          background: "rgba(17,17,17,0.9)",
          backdropFilter: "blur(10px)",
          borderTop: "1px solid #1a1a1a",
          zIndex: 3,
        }}
      >
        <div className="container-main">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "0",
            }}
          >
            {[
              { icon: Truck, title: "Tez yetkazib berish", desc: "Toshkent bo'yicha 1-2 soat" },
              { icon: Shield, title: "Kafolat", desc: "Har bir mahsulotga 1 yil" },
              { icon: Clock, title: "Muddatli to'lov", desc: "3/6/12 oygacha" },
              { icon: Award, title: "Original mahsulot", desc: "Rasmiy distribyutor" },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "16px 20px",
                  borderRight: "1px solid #1a1a1a",
                }}
              >
                <item.icon size={20} style={{ color: "#facc15", flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#f5f5f5" }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: "11px", color: "#6b6b6b" }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
