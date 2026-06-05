"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { translations } from "./translations";

export type Language = "uz" | "ru";

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations["uz"]) => string;
  isMounted: boolean;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("uz");
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language;
    if (savedLang === "uz" || savedLang === "ru") {
      setLanguageState(savedLang);
      if (typeof document !== "undefined") {
        document.cookie = `language=${savedLang}; path=/; max-age=31536000; SameSite=Lax`;
      }
    }
    setIsMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
      document.cookie = `language=${lang}; path=/; max-age=31536000; SameSite=Lax`;
    }
    router.refresh();
  };

  const t = (key: keyof typeof translations["uz"]): string => {
    const dictionary = translations[language] || translations["uz"];
    return dictionary[key] || translations["uz"][key] || String(key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isMounted }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
