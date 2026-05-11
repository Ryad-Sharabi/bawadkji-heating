"use client";

import { useEffect, useState } from "react";
import { LandingHeader } from "@components/landing/LandingHeader";
import { LandingFooter } from "@components/landing/LandingFooter";
import { PublicLocaleProvider } from "@components/landing/PublicLocaleContext";
import { translations, type Locale } from "@components/landing/translations";

const THEME_KEY = "bawadkji-theme";
const LOCALE_KEY = "bawadkji-locale";

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [locale, setLocale] = useState<Locale>("ar");
  const [navOpen, setNavOpen] = useState(false);
  const [hasReadStorage, setHasReadStorage] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedTheme = localStorage.getItem(THEME_KEY) as "dark" | "light" | null;
    const savedLocale = localStorage.getItem(LOCALE_KEY) as Locale | null;
    if (savedTheme === "dark" || savedTheme === "light") setTheme(savedTheme);
    if (savedLocale === "ar" || savedLocale === "en") setLocale(savedLocale);
    setHasReadStorage(true);
  }, []);

  useEffect(() => {
    if (!hasReadStorage) return;
    document.documentElement.lang = locale === "ar" ? "ar" : "en";
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.documentElement.setAttribute("data-theme", theme);
  }, [locale, theme, hasReadStorage]);

  const t = translations[locale];

  return (
    <div className="landing">
      <LandingHeader
        t={{ aboutUs: t.aboutUs, contactUs: t.contactUs }}
        locale={locale}
        theme={theme}
        setTheme={setTheme}
        setLocale={setLocale}
        navOpen={navOpen}
        setNavOpen={setNavOpen}
      />
      <main className="products-catalog-main">
        <PublicLocaleProvider locale={locale}>{children}</PublicLocaleProvider>
      </main>
      <LandingFooter
        t={{
          footerBrand: t.footerBrand,
          footerTagline: t.footerTagline,
          locationAddress: t.locationAddress,
          footerFollow: t.footerFollow,
          footerRights: t.footerRights,
        }}
      />
    </div>
  );
}
