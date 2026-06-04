"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, ChevronRight, MapPin, CreditCard, ShoppingCart, ShieldAlert, Loader2, Sparkles } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/mock-data";
import { useLanguage } from "@/lib/language-context";

type Step = "auth" | "delivery" | "payment" | "confirm" | "success";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartTotal, clearCart, isMounted } = useCart();
  const { language, t } = useLanguage();

  // Active step
  const [currentStep, setCurrentStep] = useState<Step>("auth");

  // Step 1: Customer Details & OTP State
  const [phone, setPhone] = useState("+998");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [name, setName] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [verifiedCustomer, setVerifiedCustomer] = useState<{ id: string; name: string; phone: string } | null>(null);
  const [mockedOtpHint, setMockedOtpHint] = useState("");

  // Step 2: Delivery State
  const [deliveryMethod, setDeliveryMethod] = useState<"BTS_EXPRESS" | "YANDEX_DELIVERY" | "PICKUP">("YANDEX_DELIVERY");
  const [address, setAddress] = useState({
    region: "Toshkent sh.",
    city: "Toshkent",
    street: "",
    house: "",
    apartment: "",
  });

  // Step 3: Payment State
  const [paymentMethod, setPaymentMethod] = useState<"CLICK" | "PAYME" | "UZUM_NASIYA" | "CASH_ON_DELIVERY">("CLICK");
  const [installmentMonths, setInstallmentMonths] = useState<"3" | "6" | "12">("12");

  // Step 4: Submission State
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [createdOrderNumber, setCreatedOrderNumber] = useState("");
  const [paymentUrl, setPaymentUrl] = useState("");

  // Load verified customer if stored
  useEffect(() => {
    const stored = localStorage.getItem("best_tools_customer");
    if (stored) {
      try {
        const cust = JSON.parse(stored);
        setVerifiedCustomer(cust);
        setName(cust.name);
        setPhone(cust.phone);
        setCurrentStep("delivery");
      } catch (e) {
        console.error("Failed to load customer profile from storage", e);
      }
    }
  }, []);

  // Validation
  if (!isMounted) return null;
  if (cartItems.length === 0 && currentStep !== "success") {
    return (
      <div className="container-main" style={{ padding: "60px 20px", textAlign: "center" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#f5f5f5", marginBottom: "16px" }}>
          {language === "ru" ? "В корзине нет товаров" : "Savatda mahsulotlar yo'q"}
        </h1>
        <p style={{ fontSize: "14px", color: "#6b6b6b", marginBottom: "24px" }}>
          {language === "ru"
            ? "Вы сможете оформить заказ после добавления товаров в корзину."
            : "Savatga mahsulot qo'shgach bu sahifaga o'ta olasiz."}
        </p>
        <Link
          href="/catalog"
          style={{
            background: "#facc15",
            color: "#0a0a0a",
            fontWeight: 700,
            padding: "12px 24px",
            borderRadius: "8px",
            textDecoration: "none",
          }}
        >
          {language === "ru" ? "Перейти в каталог" : "Katalogga o'tish"}
        </Link>
      </div>
    );
  }

  // Calculate pricing
  const shippingFee = deliveryMethod === "PICKUP" ? 0 : cartTotal > 5000000 ? 0 : 25000;
  const finalTotal = cartTotal + shippingFee;

  // Actions
  const handleSendOtp = async () => {
    if (phone.length < 13) {
      setAuthError(
        language === "ru"
          ? "Введите полный номер телефона (например, +998901234567)"
          : "Telefon raqamini to'liq kiriting (masalan, +998901234567)"
      );
      return;
    }
    setAuthError("");
    setMockedOtpHint("");
    setIsAuthLoading(true);

    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      if (!res.ok) throw new Error(language === "ru" ? "Ошибка при отправке SMS" : "SMS yuborishda xatolik yuz berdi");
      const data = await res.json();

      setIsOtpSent(true);
      if (data.mocked && data.code) {
        setMockedOtpHint(language === "ru" ? `Тестовый режим: код OTP: ${data.code}` : `Test rejimi: OTP kod: ${data.code}`);
      }
    } catch (e: any) {
      setAuthError(e.message || (language === "ru" ? "Не удалось отправить SMS" : "SMS yuborib bo'lmadi"));
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otpCode.length < 6) {
      setAuthError(language === "ru" ? "Введите код подтверждения полностью (6 цифр)" : "Tasdiqlash kodini to'liq kiriting (6 xona)");
      return;
    }
    setAuthError("");
    setIsAuthLoading(true);

    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code: otpCode, name }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || (language === "ru" ? "Неверный код" : "Kod noto'g'ri"));

      // Save customer to localStorage
      localStorage.setItem("best_tools_customer", JSON.stringify(data.customer));
      setVerifiedCustomer(data.customer);
      setCurrentStep("delivery");
    } catch (e: any) {
      setAuthError(e.message || (language === "ru" ? "Ошибка при верификации кода" : "Kod tasdiqlashda xatolik"));
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (deliveryMethod !== "PICKUP" && (!address.street || !address.house)) {
      alert(language === "ru" ? "Укажите улицу и номер дома" : "Ko'cha va uy raqamini kiriting");
      return;
    }
    setCurrentStep("payment");
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep("confirm");
  };

  const handlePlaceOrder = async () => {
    setIsSubmittingOrder(true);
    setOrderError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: verifiedCustomer?.id,
          phone,
          name: name || verifiedCustomer?.name,
          items: cartItems,
          deliveryMethod,
          deliveryAddress: deliveryMethod === "PICKUP" ? { pickupAddress: "Toshkent, Kichik xalka yo'li ko'chasi 10" } : address,
          paymentMethod,
          installmentMonths: paymentMethod === "UZUM_NASIYA" ? installmentMonths : undefined,
          totalAmount: finalTotal,
          deliveryAmount: shippingFee,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || (language === "ru" ? "Не удалось создать заказ" : "Buyurtma yaratib bo'lmadi"));

      setCreatedOrderNumber(data.orderNumber);
      setPaymentUrl(data.paymentUrl);
      clearCart();
      setCurrentStep("success");
    } catch (e: any) {
      setOrderError(e.message || (language === "ru" ? "Произошла ошибка при оформлении заказа" : "Buyurtma berishda xatolik yuz berdi"));
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const logoutCustomer = () => {
    localStorage.removeItem("best_tools_customer");
    setVerifiedCustomer(null);
    setIsOtpSent(false);
    setOtpCode("");
    setPhone("+998");
    setCurrentStep("auth");
  };

  // Rendering Helpers
  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: "8px",
    padding: "10px 12px",
    color: "#f5f5f5",
    fontSize: "14px",
    outline: "none",
  };

  const cardStyle: React.CSSProperties = {
    background: "#111111",
    border: "1px solid #1a1a1a",
    borderRadius: "12px",
    padding: "20px",
  };

  return (
    <div className="container-main" style={{ paddingTop: "32px", paddingBottom: "60px", maxWidth: "900px" }}>
      {/* Step Indicators */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
          overflowX: "auto",
          paddingBottom: "8px",
          gap: "8px",
        }}
      >
        {[
          { key: "auth", label: language === "ru" ? "Клиент" : "Mijoz", index: 1 },
          { key: "delivery", label: language === "ru" ? "Доставка" : "Yetkazib berish", index: 2 },
          { key: "payment", label: language === "ru" ? "Оплата" : "To'lov turi", index: 3 },
          { key: "confirm", label: language === "ru" ? "Подтверждение" : "Tasdiqlash", index: 4 },
        ].map((s) => {
          const isActive = currentStep === s.key;
          const isDone =
            (s.key === "auth" && verifiedCustomer) ||
            (s.key === "delivery" && currentStep !== "auth" && currentStep !== "delivery") ||
            (s.key === "payment" && currentStep === "confirm") ||
            currentStep === "success";

          return (
            <div
              key={s.key}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                opacity: isActive ? 1 : isDone ? 0.8 : 0.4,
              }}
            >
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  background: isDone ? "#22c55e" : isActive ? "#facc15" : "#1a1a1a",
                  color: isDone ? "#ffffff" : isActive ? "#0a0a0a" : "#6b6b6b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: 700,
                }}
              >
                {isDone ? "✓" : s.index}
              </div>
              <span style={{ fontSize: "13px", fontWeight: 600, color: isActive ? "#facc15" : "#f5f5f5", whiteSpace: "nowrap" }}>
                {s.label}
              </span>
              {s.index < 4 && <ChevronRight size={14} style={{ color: "#3a3a3a" }} />}
            </div>
          );
        })}
      </div>

      {/* Main Layout */}
      <div style={{ display: "grid", gridTemplateColumns: currentStep === "success" ? "1fr" : "1fr 320px", gap: "24px", alignItems: "flex-start" }} className="checkout-layout">
        {/* Left Form Panel */}
        <div>
          {/* Step 1: Authentication */}
          {currentStep === "auth" && (
            <div style={cardStyle}>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#f5f5f5", marginBottom: "20px" }}>
                {language === "ru" ? "Подтверждение номера телефона" : "Telefon raqamini tasdiqlash"}
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#6b6b6b", marginBottom: "6px", textTransform: "uppercase" }}>
                    {t("phoneNumber")} *
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+998901234567"
                    disabled={isOtpSent}
                    style={inputStyle}
                  />
                </div>

                {isOtpSent ? (
                  <>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#6b6b6b", marginBottom: "6px", textTransform: "uppercase" }}>
                        {t("recipientName")} *
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={language === "ru" ? "Например, Шерзод" : "Masalan, Sherzod"}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#6b6b6b", marginBottom: "6px", textTransform: "uppercase" }}>
                        {language === "ru" ? "SMS код *" : "SMS kod *"}
                      </label>
                      <input
                        type="text"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder={language === "ru" ? "6-значный код" : "6 xonali kod"}
                        maxLength={6}
                        style={inputStyle}
                      />
                      {mockedOtpHint && (
                        <div style={{ fontSize: "11px", color: "#facc15", background: "rgba(250,204,21,0.05)", border: "1px dashed rgba(250,204,21,0.2)", padding: "8px 10px", borderRadius: "6px", marginTop: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                          <Sparkles size={12} />
                          {mockedOtpHint}
                        </div>
                      )}
                    </div>
                  </>
                ) : null}

                {authError && <div style={{ color: "#ef4444", fontSize: "12px" }}>{authError}</div>}

                <button
                  onClick={isOtpSent ? handleVerifyOtp : handleSendOtp}
                  disabled={isAuthLoading}
                  style={{
                    width: "100%",
                    background: "#facc15",
                    color: "#0a0a0a",
                    fontWeight: 700,
                    padding: "12px",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    fontSize: "14px",
                  }}
                >
                  {isAuthLoading ? (
                    <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                  ) : null}
                  {isOtpSent ? t("verifyCode") : t("sendSms")}
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Delivery */}
          {currentStep === "delivery" && (
            <form onSubmit={handleDeliverySubmit} style={cardStyle}>
              {verifiedCustomer && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1a1a1a", paddingBottom: "12px", marginBottom: "20px" }}>
                  <div style={{ fontSize: "12px", color: "#a3a3a3" }}>
                    {language === "ru" ? "Вы вошли как:" : "Tizimga kirildi:"} <span style={{ color: "#f5f5f5", fontWeight: 600 }}>{verifiedCustomer.name} ({verifiedCustomer.phone})</span>
                  </div>
                  <button type="button" onClick={logoutCustomer} style={{ background: "none", border: "none", color: "#ef4444", fontSize: "12px", cursor: "pointer" }}>
                    {language === "ru" ? "Выйти" : "Chiqish"}
                  </button>
                </div>
              )}

              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#f5f5f5", marginBottom: "20px" }}>
                {t("shippingMethod")}
              </h2>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
                {[
                  { key: "YANDEX_DELIVERY", label: language === "ru" ? "г. Ташкент" : "Toshkent shahri", desc: language === "ru" ? "Яндекс экспресс (25k сум)" : "Yandex tezkor (25k so'm)" },
                  { key: "BTS_EXPRESS", label: language === "ru" ? "По регионам" : "Viloyatlar bo'ylab", desc: language === "ru" ? "Курьер BTS (25k сум)" : "BTS kuryer (25k so'm)" },
                ].map((m) => (
                  <div
                    key={m.key}
                    onClick={() => setDeliveryMethod(m.key as any)}
                    style={{
                      border: `1px solid ${deliveryMethod === m.key ? "#facc15" : "#1a1a1a"}`,
                      background: deliveryMethod === m.key ? "rgba(250,204,21,0.02)" : "#111111",
                      padding: "12px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    <div style={{ fontSize: "13px", fontWeight: 700, color: deliveryMethod === m.key ? "#facc15" : "#f5f5f5" }}>
                      {m.label}
                    </div>
                    <div style={{ fontSize: "11px", color: "#6b6b6b", marginTop: "4px" }}>{m.desc}</div>
                  </div>
                ))}
                <div
                  onClick={() => setDeliveryMethod("PICKUP")}
                  style={{
                    gridColumn: "1 / -1",
                    border: `1px solid ${deliveryMethod === "PICKUP" ? "#facc15" : "#1a1a1a"}`,
                    background: deliveryMethod === "PICKUP" ? "rgba(250,204,21,0.02)" : "#111111",
                    padding: "12px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  <div style={{ fontSize: "13px", fontWeight: 700, color: deliveryMethod === "PICKUP" ? "#facc15" : "#f5f5f5" }}>
                    {t("pickup")}
                  </div>
                  <div style={{ fontSize: "11px", color: "#6b6b6b", marginTop: "4px" }}>
                    {language === "ru"
                      ? "Бесплатно · г. Ташкент, Малая кольцевая 10"
                      : "Bepul · Toshkent sh., Kichik xalka yo'li ko'chasi 10"}
                  </div>
                </div>
              </div>

              {deliveryMethod !== "PICKUP" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#6b6b6b", marginBottom: "6px" }}>
                      {language === "ru" ? "Область / Город *" : "Viloyat/Shahar *"}
                    </label>
                    <input
                      type="text"
                      value={address.region}
                      onChange={(e) => setAddress((p) => ({ ...p, region: e.target.value }))}
                      placeholder={language === "ru" ? "Ташкент" : "Toshkent sh."}
                      required
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#6b6b6b", marginBottom: "6px" }}>
                      {language === "ru" ? "Город / Район *" : "Shahar/Tuman *"}
                    </label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => setAddress((p) => ({ ...p, city: e.target.value }))}
                      placeholder={language === "ru" ? "Юнусабад" : "Yunusobod"}
                      required
                      style={inputStyle}
                    />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#6b6b6b", marginBottom: "6px" }}>
                      {language === "ru" ? "Улица, Махалля и Дом *" : "Ko'cha, Mahalla va Uy *"}
                    </label>
                    <input
                      type="text"
                      value={address.street}
                      onChange={(e) => setAddress((p) => ({ ...p, street: e.target.value }))}
                      placeholder={language === "ru" ? "ул. Ахмада Дониша, дом 24" : "Ahmad Donish ko'chasi, 24-uy"}
                      required
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#6b6b6b", marginBottom: "6px" }}>
                      {language === "ru" ? "Подъезд" : "Kirish/Podezd"}
                    </label>
                    <input
                      type="text"
                      value={address.house}
                      onChange={(e) => setAddress((p) => ({ ...p, house: e.target.value }))}
                      placeholder={language === "ru" ? "подъезд 2" : "2-podezd"}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#6b6b6b", marginBottom: "6px" }}>
                      {language === "ru" ? "Квартира" : "Xonadon (Kvartira)"}
                    </label>
                    <input
                      type="text"
                      value={address.apartment}
                      onChange={(e) => setAddress((p) => ({ ...p, apartment: e.target.value }))}
                      placeholder={language === "ru" ? "кв. 45" : "45-xonadon"}
                      style={inputStyle}
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                style={{
                  width: "100%",
                  background: "#facc15",
                  color: "#0a0a0a",
                  fontWeight: 700,
                  padding: "12px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                  marginTop: "20px",
                }}
              >
                {language === "ru" ? "Выбрать способ оплаты →" : "To'lov usulini tanlash →"}
              </button>
            </form>
          )}

          {/* Step 3: Payment Method */}
          {currentStep === "payment" && (
            <form onSubmit={handlePaymentSubmit} style={cardStyle}>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#f5f5f5", marginBottom: "20px" }}>
                {t("paymentMethod")}
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
                {[
                  { key: "CLICK", label: language === "ru" ? "Click (Картой)" : "Click (Karta orqali)", desc: language === "ru" ? "Перенаправление на сайт Click" : "Click saytiga yo'naltiriladi" },
                  { key: "PAYME", label: language === "ru" ? "Payme (Картой)" : "Payme (Karta orqali)", desc: language === "ru" ? "Перенаправление на сайт Payme" : "Payme saytiga yo'naltiriladi" },
                  { key: "UZUM_NASIYA", label: language === "ru" ? "Uzum Nasiya (Рассрочка)" : "Uzum Nasiya (Muddatli to'lov)", desc: language === "ru" ? "Оплата частями" : "Bo'lib-bo'lib to'lash" },
                  { key: "CASH_ON_DELIVERY", label: language === "ru" ? "Курьеру (Наличные / Карта)" : "Kuryerga (Naqd / Karta)", desc: language === "ru" ? "Оплата при получении товара" : "Mahsulot yetib kelganda to'lov qilinadi" },
                ].map((p) => (
                  <div
                    key={p.key}
                    onClick={() => setPaymentMethod(p.key as any)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      border: `1px solid ${paymentMethod === p.key ? "#facc15" : "#1a1a1a"}`,
                      background: paymentMethod === p.key ? "rgba(250,204,21,0.02)" : "#111111",
                      padding: "14px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    <input
                      type="radio"
                      checked={paymentMethod === p.key}
                      onChange={() => {}}
                      style={{ accentColor: "#facc15", marginRight: "12px" }}
                    />
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: paymentMethod === p.key ? "#facc15" : "#f5f5f5" }}>
                        {p.label}
                      </div>
                      <div style={{ fontSize: "11px", color: "#6b6b6b", marginTop: "2px" }}>{p.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {paymentMethod === "UZUM_NASIYA" && (
                <div style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "16px", marginBottom: "20px" }}>
                  <div style={{ fontSize: "12px", color: "#a3a3a3", fontWeight: 600, marginBottom: "10px" }}>
                    {language === "ru" ? "Выберите срок:" : "Muddatni tanlang:"}
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {["3", "6", "12"].map((months) => (
                      <div
                        key={months}
                        onClick={() => setInstallmentMonths(months as any)}
                        style={{
                          flex: 1,
                          background: installmentMonths === months ? "rgba(250,204,21,0.1)" : "#111111",
                          border: `1px solid ${installmentMonths === months ? "#facc15" : "#2a2a2a"}`,
                          borderRadius: "8px",
                          padding: "10px",
                          textAlign: "center",
                          cursor: "pointer",
                        }}
                      >
                        <div style={{ fontSize: "11px", color: "#a3a3a3" }}>
                          {months} {language === "ru" ? "мес." : "oy"}
                        </div>
                        <div style={{ fontSize: "13px", fontWeight: 700, color: "#facc15", marginTop: "4px" }}>
                          {Math.ceil(finalTotal / parseInt(months)).toLocaleString()} {language === "ru" ? "сум/мес" : "so'm/oy"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setCurrentStep("delivery")}
                  style={{
                    flex: 1,
                    background: "#1a1a1a",
                    border: "1px solid #2a2a2a",
                    color: "#a3a3a3",
                    padding: "12px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  {t("back")}
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 2,
                    background: "#facc15",
                    color: "#0a0a0a",
                    fontWeight: 700,
                    padding: "12px",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  {language === "ru" ? "Перейти к подтверждению →" : "Tasdiqlashga o'tish →"}
                </button>
              </div>
            </form>
          )}

          {/* Step 4: Confirm Order */}
          {currentStep === "confirm" && (
            <div style={cardStyle}>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#f5f5f5", marginBottom: "20px" }}>
                {t("confirmOrder")}
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
                <div style={{ borderBottom: "1px solid #1a1a1a", paddingBottom: "12px" }}>
                  <div style={{ fontSize: "11px", color: "#6b6b6b", fontWeight: 600, textTransform: "uppercase" }}>
                    {language === "ru" ? "Клиент" : "Mijoz"}
                  </div>
                  <div style={{ fontSize: "14px", color: "#f5f5f5", fontWeight: 500, marginTop: "4px" }}>
                    {name || verifiedCustomer?.name} ({phone})
                  </div>
                </div>

                <div style={{ borderBottom: "1px solid #1a1a1a", paddingBottom: "12px" }}>
                  <div style={{ fontSize: "11px", color: "#6b6b6b", fontWeight: 600, textTransform: "uppercase" }}>
                    {language === "ru" ? "Доставка" : "Yetkazib berish"}
                  </div>
                  <div style={{ fontSize: "14px", color: "#f5f5f5", fontWeight: 500, marginTop: "4px" }}>
                    {deliveryMethod === "PICKUP" ? (
                      <span>{language === "ru" ? "Самовывоз (Ташкент, Малая кольцевая 10)" : "Do'kondan olib ketish (Toshkent, Kichik xalka yo'li 10)"}</span>
                    ) : (
                      <span>{address.region}, {address.city}, {address.street} {address.house} {address.apartment}</span>
                    )}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: "11px", color: "#6b6b6b", fontWeight: 600, textTransform: "uppercase" }}>
                    {language === "ru" ? "Способ оплаты" : "To'lov turi"}
                  </div>
                  <div style={{ fontSize: "14px", color: "#facc15", fontWeight: 600, marginTop: "4px" }}>
                    {paymentMethod === "CLICK" ? (language === "ru" ? "CLICK (Картой)" : "CLICK (Plastik karta)") :
                     paymentMethod === "PAYME" ? (language === "ru" ? "PAYME (Картой)" : "PAYME (Plastik karta)") :
                     paymentMethod === "UZUM_NASIYA" ? `Uzum Nasiya (${installmentMonths} ${language === "ru" ? "мес." : "oy"})` :
                     (language === "ru" ? "Наличными при получении" : "Naqd yetkazib berilganda")}
                  </div>
                </div>
              </div>

              {orderError && (
                <div style={{ color: "#ef4444", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", padding: "10px 12px", borderRadius: "8px", marginBottom: "16px", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <ShieldAlert size={16} />
                  {orderError}
                </div>
              )}

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => setCurrentStep("payment")}
                  style={{
                    flex: 1,
                    background: "#1a1a1a",
                    border: "1px solid #2a2a2a",
                    color: "#a3a3a3",
                    padding: "12px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  {t("back")}
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={isSubmittingOrder}
                  style={{
                    flex: 2,
                    background: "#facc15",
                    color: "#0a0a0a",
                    fontWeight: 700,
                    padding: "12px",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  {isSubmittingOrder ? (
                    <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                  ) : null}
                  {t("placeOrder")}
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Success State */}
          {currentStep === "success" && (
            <div style={{ ...cardStyle, textAlign: "center", padding: "40px 20px" }}>
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  background: "rgba(34,197,94,0.1)",
                  border: "1px solid rgba(34,197,94,0.3)",
                  borderRadius: "50%",
                  color: "#22c55e",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                }}
              >
                <CheckCircle2 size={36} />
              </div>

              <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#f5f5f5", marginBottom: "8px" }}>
                {t("orderSuccess")}
              </h2>

              <p style={{ fontSize: "14px", color: "#6b6b6b", marginBottom: "24px" }}>
                {t("orderNumber")}: <span style={{ color: "#facc15", fontWeight: 700 }}>{createdOrderNumber}</span>
              </p>

              {paymentUrl ? (
                <div style={{ maxWidth: "300px", margin: "0 auto 24px", background: "#1a1a1a", border: "1px solid #2a2a2a", padding: "16px", borderRadius: "10px" }}>
                  <div style={{ fontSize: "13px", color: "#a3a3a3", marginBottom: "12px" }}>
                    {language === "ru" ? "Для активации заказа произведите оплату:" : "Buyurtmani faollashtirish uchun to'lov qiling:"}
                  </div>
                  <a
                    href={paymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      background: "#facc15",
                      color: "#0a0a0a",
                      fontWeight: 700,
                      padding: "12px",
                      borderRadius: "8px",
                      textDecoration: "none",
                      fontSize: "14px",
                    }}
                  >
                    <CreditCard size={16} />
                    {language === "ru" ? `Оплатить через ${paymentMethod}` : `${paymentMethod} orqali to'lash`}
                  </a>
                </div>
              ) : (
                <p style={{ fontSize: "13px", color: "#a3a3a3", marginBottom: "32px", maxWidth: "450px", margin: "0 auto 32px" }}>
                  {t("orderSuccessDesc")}
                </p>
              )}

              <Link
                href="/"
                style={{
                  display: "inline-flex",
                  background: "#1a1a1a",
                  border: "1px solid #2a2a2a",
                  color: "#f5f5f5",
                  fontWeight: 600,
                  padding: "10px 20px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontSize: "13px",
                }}
              >
                {language === "ru" ? "Вернуться на главную" : "Bosh sahifaga qaytish"}
              </Link>
            </div>
          )}
        </div>

        {/* Right Summary Panel (Not visible on success) */}
        {currentStep !== "success" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ background: "#111111", border: "1px solid #1a1a1a", borderRadius: "12px", padding: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", borderBottom: "1px solid #1a1a1a", paddingBottom: "12px" }}>
                <ShoppingCart size={16} style={{ color: "#facc15" }} />
                <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#f5f5f5" }}>
                  {language === "ru" ? "Содержимое корзины" : "Savat tarkibi"}
                </h3>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "180px", overflowY: "auto", marginBottom: "16px" }}>
                {cartItems.map((item) => (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px" }}>
                    <div style={{ flex: 1, minWidth: 0, paddingRight: "10px" }}>
                      <div style={{ color: "#a3a3a3", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</div>
                      <div style={{ fontSize: "11px", color: "#4a4a4a" }}>{item.quantity} × {formatPrice(item.price)}</div>
                    </div>
                    <span style={{ fontWeight: 600, color: "#f5f5f5" }}>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", borderTop: "1px solid #1a1a1a", paddingTop: "14px", fontSize: "12px", color: "#6b6b6b" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>{t("subtotal")}</span>
                  <span style={{ color: "#a3a3a3" }}>{formatPrice(cartTotal)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>{t("delivery")}</span>
                  <span style={{ color: shippingFee === 0 ? "#22c55e" : "#a3a3a3" }}>
                    {shippingFee === 0 ? (language === "ru" ? "Бесплатно" : "Bepul") : formatPrice(shippingFee)}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #1a1a1a", paddingTop: "10px", fontSize: "14px", fontWeight: 700 }}>
                  <span style={{ color: "#f5f5f5" }}>{t("total")}</span>
                  <span style={{ color: "#facc15" }}>{formatPrice(finalTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 800px) {
          .checkout-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
