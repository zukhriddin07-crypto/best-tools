import React from "react";
import type { Metadata } from "next";
import HeroBanner from "@/components/shop/HeroBanner";
import BrandsSection from "@/components/shop/BrandsSection";
import CategoriesSection from "@/components/shop/CategoriesSection";
import FeaturedProducts from "@/components/shop/FeaturedProducts";
import SaleSection from "@/components/shop/SaleSection";

export const metadata: Metadata = {
  title: "Best Tools — Professional Elektr Asboblar | Bosch, Milwaukee, DeWalt",
  description:
    "O'zbekistondagi eng yaxshi professional elektr asboblar do'koni. Bosch, Milwaukee, DeWalt, Makita, Hilti. Bo'lib to'lash, tez yetkazib berish, 1 yil kafolat.",
  keywords:
    "elektr asboblar, drel, perforator, Bosch, Milwaukee, DeWalt, Makita, Toshkent, O'zbekiston",
  openGraph: {
    title: "Best Tools — Professional Elektr Asboblar",
    description: "Bosch, Milwaukee, DeWalt va boshqa premium brendlar. Bo'lib to'lash bilan.",
    url: "https://besttools.uz",
    siteName: "Best Tools",
    locale: "uz_UZ",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <BrandsSection />
      <CategoriesSection />
      <FeaturedProducts />
      <SaleSection />
    </>
  );
}
