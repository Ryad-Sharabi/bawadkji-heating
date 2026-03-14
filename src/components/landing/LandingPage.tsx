"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { translations, type Locale } from "./translations";
import { LandingHeader } from "./LandingHeader";
import { LandingFooter } from "./LandingFooter";

const THEME_KEY = "bawadkji-theme";
const LOCALE_KEY = "bawadkji-locale";

const PARTNERS_BRANDS = [
  { src: "/carisa.jpg", alt: "Carisa" },
  { src: "/ezinc.jpg", alt: "Ezinc" },
  { src: "/icma.jpg", alt: "ICMA" },
  { src: "/Kas.jpg", alt: "Kas" },
  { src: "/kermi.jpg", alt: "Kermi" },
  { src: "/wilo.jpg", alt: "Wilo" },
  { src: "/riello.png", alt: "Riello" },
];

const CATEGORIES_GRID = [
  { src: "/solar.png", titleKey: "catSolar" as const },
  { src: "/burner.png", titleKey: "catBurners" as const },
  { src: "/pumps.png", titleKey: "catPumps" as const },
  { src: "/accessories.png", titleKey: "catAccessories" as const },
  { src: "/coler.png", titleKey: "catAc" as const },
  { src: "/shofage.png", titleKey: "catRadiators" as const },
  { src: "/ppr.png", titleKey: "catPpr" as const },
  { src: "/pex.png", titleKey: "catPex" as const },
];

export function LandingPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mounted, setMounted] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [locale, setLocale] = useState<Locale>("ar");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {});
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedTheme = localStorage.getItem(THEME_KEY) as "dark" | "light" | null;
    const savedLocale = localStorage.getItem(LOCALE_KEY) as Locale | null;
    if (savedTheme === "dark" || savedTheme === "light") setTheme(savedTheme);
    if (savedLocale === "ar" || savedLocale === "en") setLocale(savedLocale);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === "ar" ? "ar" : "en";
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.documentElement.setAttribute("data-theme", theme);
  }, [locale, theme]);

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

      <section className="landing-hero" aria-label="Hero">
        <div className="landing-hero-video-wrap">
          <video
            ref={videoRef}
            src="/hero.mp4"
            muted
            loop
            playsInline
            poster=""
            aria-hidden
          />
        </div>
        <div className="landing-hero-overlay" aria-hidden />
        <div className="landing-hero-content">
          <span className="landing-hero-badge">{t.heroBadge}</span>
          <h1 className="landing-hero-title">{t.heroTitle}</h1>
          <p className="landing-hero-tagline">{t.heroTagline}</p>
          <div className="landing-hero-cta">
            <Link href="/about" className="landing-btn">{t.aboutUs}</Link>
            <a href="https://wa.me/963933204343" target="_blank" rel="noopener noreferrer" className="landing-btn landing-btn-primary">{t.contactUs}</a>
          </div>
        </div>
      </section>

      <section className="landing-partners section" aria-label="Partners">
        <div className="landing-partners-container container">
          <div className="landing-partners-heading heading-section">
            <div className="landing-partners-subtitle heading-subtitle">{t.partnersSubtitle}</div>
            <h2 className="landing-partners-title heading-title">{t.partnersTitle}</h2>
            <p className="landing-partners-description heading-description">{t.partnersDescription}</p>
          </div>
          {mounted ? (
            <Swiper
              modules={[Autoplay]}
              className="landing-partners-swiper trusted-clients"
              loop={true}
              slidesPerView={5}
              spaceBetween={30}
              centeredSlides={true}
              autoplay={{ delay: 2500, disableOnInteraction: false }}
              breakpoints={{
                320: { slidesPerView: 2, spaceBetween: 16 },
                640: { slidesPerView: 3, spaceBetween: 20 },
                1024: { slidesPerView: 5, spaceBetween: 30 },
              }}
            >
              {PARTNERS_BRANDS.map((brand) => (
                <SwiperSlide key={brand.alt}>
                  <div className="landing-partners-logo-wrap">
                    <Image src={brand.src} alt={brand.alt} width={120} height={48} className="landing-partners-logo" />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="landing-partners-swiper trusted-clients" style={{ minHeight: 72 }} aria-hidden />
          )}
        </div>
      </section>

      <section className="landing-services section" id="service" aria-label={t.servicesTitle}>
        <div className="landing-services-container container">
          <div className="landing-services-heading heading-section">
            <div className="landing-services-subtitle heading-subtitle">{t.servicesSubtitle}</div>
            <h2 className="landing-services-title heading-title">{t.servicesTitle}</h2>
            <p className="landing-services-description heading-description">{t.servicesDescription}</p>
          </div>
          <div className="landing-services-row">
            <div className="landing-services-cards">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="landing-service-card">
                  <div className="landing-service-card-icon">
                    {i === 1 && (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83M8 12h8M6 8v8h12V8H6z"/></svg>
                    )}
                    {i === 2 && (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.08-2.08-.5-4 3-4 2.5 0 3 1.5 3 3 0 1.5-1 2.5-2 3.5"/><path d="M14 15h4a2 2 0 0 1 2 2v2"/><path d="M15 15h-2a2 2 0 0 0-2 2v2"/><path d="M12 22v-4"/><path d="M10 22h4"/></svg>
                    )}
                    {i === 3 && (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                    )}
                    {i === 4 && (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                    )}
                    {i === 5 && (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
                    )}
                    {i === 6 && (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/><path d="M16 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"/><path d="M12 12v4"/></svg>
                    )}
                  </div>
                  <div className="landing-service-card-body">
                    <h3 className="landing-service-card-title">{t[`service${i}Title` as keyof typeof t]}</h3>
                    <p className="landing-service-card-desc">{t[`service${i}Desc` as keyof typeof t]}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="landing-services-image-wrap">
              <Image src="/section.jpg" alt="" width={480} height={400} className="landing-services-image" />
            </div>
          </div>
        </div>
      </section>

      <section className="landing-categories section" id="categories" aria-label={t.categoriesTitle}>
        <div className="landing-categories-container container">
          <div className="landing-categories-heading heading-section">
            <div className="landing-categories-subtitle heading-subtitle">{t.categoriesSubtitle}</div>
            <h2 className="landing-categories-title heading-title">{t.categoriesTitle}</h2>
          </div>
          <div className="landing-categories-grid">
            {CATEGORIES_GRID.map((cat) => (
              <article key={cat.titleKey} className="landing-category-card">
                <div className="landing-category-card-image-wrap">
                  <Image src={cat.src} alt="" width={320} height={200} className="landing-category-card-image" />
                </div>
                <h3 className="landing-category-card-title">{t[cat.titleKey]}</h3>
                <Link href={`/products?category=${cat.titleKey}`} className="landing-category-card-cta landing-btn landing-btn-primary">
                  {t.categoriesCta}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-location section" id="location" aria-label={t.locationTitle}>
        <div className="landing-location-container container">
          <h2 className="landing-location-title">{t.locationTitle}</h2>
          <p className="landing-location-address">{t.locationAddress}</p>
          <div className="landing-location-image-wrap">
            <Image src="/location.jpg" alt="" width={960} height={540} className="landing-location-image" />
          </div>
        </div>
      </section>

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
