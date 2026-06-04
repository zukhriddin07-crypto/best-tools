"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, ShieldCheck, CheckCircle2, ArrowLeft, FileText, AlertCircle } from "lucide-react";
import { formatPrice } from "@/lib/mock-data";

function UzumNasiyaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const orderNumber = searchParams.get("order") || "BT-2026-0000";
  const amountStr = searchParams.get("amount") || "0";
  const monthsStr = searchParams.get("months") || "12";

  const amount = parseFloat(amountStr);
  const months = parseInt(monthsStr);
  const monthlyPayment = Math.ceil(amount / months);

  const [step, setStep] = useState<"checking" | "sign" | "success" | "error">("checking");
  const [smsCode, setSmsCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // Step 1: Simulate limit scoring check for 2.5 seconds
    const timer = setTimeout(() => {
      setStep("sign");
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleSignContract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (smsCode.length < 6) {
      alert("SMS tasdiqlash kodini to'liq kiriting (6 xona)");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const contractId = `UN-${Math.floor(10000000 + Math.random() * 90000000)}`;

      // Firing webhook to mark the order as paid on the server
      const webhookRes = await fetch("/api/payment/uzum-nasiya-webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber,
          status: "APPROVED",
          contractId,
          token: "dummy_uzum_secret",
        }),
      });

      if (!webhookRes.ok) {
        throw new Error("Shartnoma to'lovini qayta ishlashda xatolik yuz berdi");
      }

      setStep("success");
    } catch (e: any) {
      setStep("error");
      setErrorMsg(e.message || "Ulanish xatosi");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "#ffffff",
    border: "1px solid #dcdcdc",
    borderRadius: "8px",
    padding: "12px",
    color: "#1d1d1f",
    fontSize: "16px",
    textAlign: "center",
    letterSpacing: "0.2em",
    outline: "none",
    fontWeight: 700,
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7f7f9",
        color: "#1d1d1f",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          background: "#ffffff",
          borderRadius: "20px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.06)",
          overflow: "hidden",
          border: "1px solid #eaeaea",
        }}
      >
        {/* Uzum Header Banner */}
        <div
          style={{
            background: "linear-gradient(135deg, #7c3aed 0%, #d946ef 100%)",
            padding: "24px 20px",
            color: "#ffffff",
            textAlign: "center",
            position: "relative",
          }}
        >
          <div style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "-0.01em" }}>
            uzum <span style={{ fontWeight: 400 }}>nasiya</span>
          </div>
          <div style={{ fontSize: "11px", opacity: 0.8, marginTop: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Muddatli to&#39;lov shartnomasi
          </div>
        </div>

        {/* Content Box */}
        <div style={{ padding: "24px" }}>
          {/* Order Details Panel */}
          {step !== "success" && step !== "error" && (
            <div
              style={{
                background: "#fbfbfe",
                border: "1px solid #eef2ff",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "24px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#6b7280", marginBottom: "8px" }}>
                <span>Buyurtma:</span>
                <span style={{ fontWeight: 700, color: "#1d1d1f" }}>{orderNumber}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#6b7280", marginBottom: "8px" }}>
                <span>Umumiy summa:</span>
                <span style={{ fontWeight: 700, color: "#1d1d1f" }}>{formatPrice(amount)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#6b7280", marginBottom: "8px" }}>
                <span>Muddat:</span>
                <span style={{ fontWeight: 700, color: "#1d1d1f" }}>{months} oy</span>
              </div>
              <div
                style={{
                  borderTop: "1px dashed #eef2ff",
                  paddingTop: "8px",
                  marginTop: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "14px",
                  fontWeight: 800,
                  color: "#7c3aed",
                }}
              >
                <span>Oylik to&#39;lov:</span>
                <span>{formatPrice(monthlyPayment)}/oy</span>
              </div>
            </div>
          )}

          {/* Step 1: Checking limit */}
          {step === "checking" && (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <Loader2 size={36} style={{ color: "#7c3aed", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1d1d1f", marginBottom: "8px" }}>
                Mijoz limitini tekshirish
              </h3>
              <p style={{ fontSize: "13px", color: "#6b7280" }}>
                Uzum Nasiya scoring tizimi buyurtmani qayta ishlamoqda. Iltimos, kuting...
              </p>
            </div>
          )}

          {/* Step 2: Sign Contract */}
          {step === "sign" && (
            <form onSubmit={handleSignContract}>
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <ShieldCheck size={32} style={{ color: "#22c55e", margin: "0 auto 8px" }} />
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1d1d1f", marginBottom: "6px" }}>
                  SMS orqali imzolash
                </h3>
                <p style={{ fontSize: "13px", color: "#6b7280", padding: "0 10px" }}>
                  Shartnomani tasdiqlash uchun telefoningizga yuborilgan 6 xonali SMS kodni kiriting.
                </p>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  value={smsCode}
                  onChange={(e) => setSmsCode(e.target.value)}
                  style={inputStyle}
                  required
                />
                <div style={{ fontSize: "11px", color: "#7c3aed", textAlign: "center", marginTop: "8px", fontWeight: 600 }}>
                  Test kodi: ixtiyoriy 6 ta raqam (masalan, 123456)
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: "100%",
                  background: "#7c3aed",
                  color: "#ffffff",
                  fontWeight: 700,
                  padding: "14px",
                  borderRadius: "10px",
                  border: "none",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  fontSize: "15px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  boxShadow: "0 4px 15px rgba(124,58,237,0.15)",
                }}
              >
                {isSubmitting ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : null}
                Shartnomani imzolash
              </button>
            </form>
          )}

          {/* Step 3: Success Screen */}
          {step === "success" && (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <CheckCircle2 size={48} style={{ color: "#22c55e", margin: "0 auto 16px" }} />
              <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#1d1d1f", marginBottom: "8px" }}>
                Shartnoma muvaffaqiyatli imzolandi!
              </h3>
              <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "24px", padding: "0 10px" }}>
                Muddatli to&#39;lov shartnomasi rasmiylashtirildi. Buyurtmangiz to&#39;landi va tayyorlashga yuborildi.
              </p>
              <button
                onClick={() => router.push("/")}
                style={{
                  width: "100%",
                  background: "#1d1d1f",
                  color: "#ffffff",
                  fontWeight: 700,
                  padding: "12px",
                  borderRadius: "10px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Do&#39;konga qaytish
              </button>
            </div>
          )}

          {/* Step 4: Error Screen */}
          {step === "error" && (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <AlertCircle size={48} style={{ color: "#ef4444", margin: "0 auto 16px" }} />
              <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#1d1d1f", marginBottom: "8px" }}>
                To&#39;lovda xatolik
              </h3>
              <p style={{ fontSize: "13px", color: "#6b6b6b", marginBottom: "24px" }}>
                {errorMsg || "Shartnoma rasmiylashtirishda noma'lum xatolik yuz berdi."}
              </p>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => setStep("sign")}
                  style={{
                    flex: 1,
                    background: "#7c3aed",
                    color: "#ffffff",
                    fontWeight: 700,
                    padding: "12px",
                    borderRadius: "10px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Qayta urinish
                </button>
                <button
                  onClick={() => router.push("/")}
                  style={{
                    flex: 1,
                    background: "#eaeaea",
                    color: "#1d1d1f",
                    fontWeight: 600,
                    padding: "12px",
                    borderRadius: "10px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Bekor qilish
                </button>
              </div>
            </div>
          )}
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

export default function UzumNasiyaPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f7f7f9" }}>
        <Loader2 size={32} style={{ animation: "spin 1s linear infinite", color: "#7c3aed" }} />
      </div>
    }>
      <UzumNasiyaContent />
    </Suspense>
  );
}
