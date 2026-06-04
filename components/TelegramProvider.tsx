"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Script from "next/script";

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface TelegramContextType {
  isTelegramWebApp: boolean;
  telegramUser: TelegramUser | null;
  webApp: any | null;
}

const TelegramContext = createContext<TelegramContextType>({
  isTelegramWebApp: false,
  telegramUser: null,
  webApp: null,
});

export const TelegramProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTelegramWebApp, setIsTelegramWebApp] = useState(false);
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null);
  const [webApp, setWebApp] = useState<any | null>(null);

  useEffect(() => {
    // Check if window.Telegram is available (script has loaded)
    const checkTelegram = () => {
      const tg = (window as any).Telegram?.WebApp;
      if (tg && tg.initData) {
        setIsTelegramWebApp(true);
        setWebApp(tg);
        
        // Expand the webapp to full height
        tg.ready();
        tg.expand();

        // Retrieve user information
        const user = tg.initDataUnsafe?.user;
        if (user) {
          setTelegramUser(user);
          console.log("[TELEGRAM WEBAPP] Opened by user:", user);

          // Auto-authentication logic:
          // Simulate customer session by storing customer details in localStorage
          const mockCustomer = {
            id: `tg-${user.id}`,
            name: `${user.first_name} ${user.last_name || ""}`.trim(),
            phone: "+998900000000", // placeholder phone number for Telegram users
            telegramId: String(user.id),
          };
          localStorage.setItem("best_tools_customer", JSON.stringify(mockCustomer));

          // Set Telegram theme color classes or custom variables
          document.documentElement.style.setProperty("--bg-base", tg.themeParams?.bg_color || "#0a0a0a");
          document.documentElement.style.setProperty("--bg-card", tg.themeParams?.secondary_bg_color || "#111111");
          document.documentElement.style.setProperty("--primary", tg.themeParams?.button_color || "#facc15");
          document.documentElement.style.setProperty("--f foreground", tg.themeParams?.text_color || "#f5f5f5");
        }
      }
    };

    // Run check immediately and also listen for script load
    checkTelegram();
    
    // Fallback interval check in case script takes time to initialize
    const interval = setInterval(checkTelegram, 250);
    const timeout = setTimeout(() => clearInterval(interval), 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <>
      <Script
        src="https://telegram.org/js/telegram-web-app.js"
        strategy="beforeInteractive"
        onLoad={() => console.log("Telegram WebApp Script loaded successfully")}
      />
      <TelegramContext.Provider value={{ isTelegramWebApp, telegramUser, webApp }}>
        {children}
      </TelegramContext.Provider>
    </>
  );
};

export const useTelegram = () => useContext(TelegramContext);
