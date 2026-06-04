import type { Metadata, Viewport } from "next";

import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Best Tools — Professional Elektr Asboblar O'zbekiston",
    template: "%s | Best Tools",
  },
  description:
    "O'zbekistondagi eng yaxshi professional elektr asboblar do'koni. Bosch, Milwaukee, DeWalt, Makita, Hilti, Metabo. Bo'lib to'lash, tez yetkazib berish.",
  metadataBase: new URL("https://besttools.uz"),
  keywords: [
    "elektr asboblar",
    "drel",
    "perforator",
    "Bosch",
    "Milwaukee",
    "DeWalt",
    "Makita",
    "Toshkent",
    "O'zbekiston",
    "power tools",
  ],
  authors: [{ name: "Best Tools" }],
  creator: "Best Tools",
  robots: {
    index: true,
    follow: true,
  },
};

import { CartProvider } from "@/lib/cart-context";
import { TelegramProvider } from "@/components/TelegramProvider";
import { LanguageProvider } from "@/lib/language-context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className={inter.variable}>
      <body
        style={{
          background: "#0a0a0a",
          color: "#f5f5f5",
          minHeight: "100vh",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <TelegramProvider>
          <LanguageProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </LanguageProvider>
        </TelegramProvider>
      </body>
    </html>
  );
}


