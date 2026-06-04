"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email yoki parol noto'g'ri");
      } else {
        router.push("/admin/dashboard");
        router.refresh();
      }
    } catch {
      setError("Xatolik yuz berdi. Qayta urinib ko'ring.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background grid */}
      <div
        className="bg-grid-pattern"
        style={{ position: "absolute", inset: 0, opacity: 0.5 }}
      />

      {/* Yellow glow */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(250,204,21,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "420px",
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              background: "#facc15",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              fontSize: "28px",
              color: "#0a0a0a",
              marginBottom: "16px",
              boxShadow: "0 0 30px rgba(250,204,21,0.3)",
            }}
          >
            B
          </div>
          <h1
            style={{
              fontSize: "22px",
              fontWeight: 800,
              color: "#f5f5f5",
              letterSpacing: "-0.02em",
            }}
          >
            BEST <span style={{ color: "#facc15" }}>TOOLS</span>
          </h1>
          <p style={{ color: "#6b6b6b", fontSize: "13px", marginTop: "4px" }}>
            Admin boshqaruv paneli
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: "#111111",
            border: "1px solid #1a1a1a",
            borderRadius: "16px",
            padding: "32px",
          }}
        >
          <h2
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "#f5f5f5",
              marginBottom: "24px",
            }}
          >
            Kirish
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Error */}
            {error && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  borderRadius: "8px",
                  padding: "12px 14px",
                  marginBottom: "20px",
                  fontSize: "13px",
                  color: "#ef4444",
                }}
              >
                <AlertCircle size={15} />
                {error}
              </div>
            )}

            {/* Email */}
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#a3a3a3",
                  marginBottom: "8px",
                }}
              >
                Email manzil
              </label>
              <div style={{ position: "relative" }}>
                <Mail
                  size={15}
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#6b6b6b",
                  }}
                />
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@besttools.uz"
                  required
                  style={{
                    width: "100%",
                    background: "#1a1a1a",
                    border: "1px solid #2a2a2a",
                    borderRadius: "8px",
                    padding: "11px 12px 11px 38px",
                    color: "#f5f5f5",
                    fontSize: "14px",
                    outline: "none",
                    transition: "all 0.2s",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#facc15";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(250,204,21,0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#2a2a2a";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#a3a3a3",
                  marginBottom: "8px",
                }}
              >
                Parol
              </label>
              <div style={{ position: "relative" }}>
                <Lock
                  size={15}
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#6b6b6b",
                  }}
                />
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: "100%",
                    background: "#1a1a1a",
                    border: "1px solid #2a2a2a",
                    borderRadius: "8px",
                    padding: "11px 40px 11px 38px",
                    color: "#f5f5f5",
                    fontSize: "14px",
                    outline: "none",
                    transition: "all 0.2s",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#facc15";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(250,204,21,0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#2a2a2a";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#6b6b6b",
                    padding: "0",
                    display: "flex",
                  }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                background: isLoading ? "#a08a0a" : "#facc15",
                color: "#0a0a0a",
                fontWeight: 700,
                padding: "13px",
                borderRadius: "10px",
                border: "none",
                cursor: isLoading ? "not-allowed" : "pointer",
                fontSize: "15px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "all 0.2s",
              }}
            >
              {isLoading ? (
                <>
                  <div
                    style={{
                      width: "16px",
                      height: "16px",
                      border: "2px solid rgba(0,0,0,0.3)",
                      borderTopColor: "#0a0a0a",
                      borderRadius: "50%",
                      animation: "spin 0.8s linear infinite",
                    }}
                  />
                  Kirish...
                </>
              ) : (
                "Kirish"
              )}
            </button>
          </form>

          {/* Hint */}
          <div
            style={{
              marginTop: "20px",
              padding: "12px",
              background: "rgba(250,204,21,0.04)",
              border: "1px solid rgba(250,204,21,0.1)",
              borderRadius: "8px",
            }}
          >
            <p style={{ fontSize: "12px", color: "#6b6b6b", textAlign: "center" }}>
              Test kirish:{" "}
              <span style={{ color: "#facc15" }}>admin@besttools.uz</span>
              {" / "}
              <span style={{ color: "#facc15" }}>password</span>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
