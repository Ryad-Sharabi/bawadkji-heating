"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { translations, type Locale } from "@/components/landing/translations";

const THEME_KEY = "bawadkji-theme";
const LOCALE_KEY = "bawadkji-locale";

const LANG_OPTIONS: { value: Locale; label: string }[] = [
  { value: "ar", label: "العربية" },
  { value: "en", label: "English" },
];

const WORK_KEYS = [
  "work1",
  "work2",
  "work3",
  "work4",
  "work5",
  "work6",
  "work7",
  "work8",
  "work9",
  "work10",
  "work11",
  "work12",
] as const;

export default function AboutPage() {
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [locale, setLocale] = useState<Locale>("ar");
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY) as "dark" | "light" | null;
    const savedLocale = localStorage.getItem(LOCALE_KEY) as Locale | null;
    if (savedTheme === "dark" || savedTheme === "light") setTheme(savedTheme);
    if (savedLocale === "ar" || savedLocale === "en") setLocale(savedLocale);
    setSynced(true);
  }, []);

  useEffect(() => {
    if (!synced) return;
    document.documentElement.lang = locale === "ar" ? "ar" : "en";
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.documentElement.setAttribute("data-theme", theme);
  }, [locale, theme, synced]);

  useEffect(() => {
    if (!langDropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [langDropdownOpen]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem(THEME_KEY, next);
    document.documentElement.setAttribute("data-theme", next);
  };

  const setLocaleAndClose = (next: Locale) => {
    setLocale(next);
    setLangDropdownOpen(false);
    localStorage.setItem(LOCALE_KEY, next);
    document.documentElement.lang = next === "ar" ? "ar" : "en";
    document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
  };

  const t = translations[locale];

  return (
    <div className="landing about-page">
      <header className="landing-header about-page-header" dir="ltr">
        <Link href="/" className="landing-brand" aria-label="Home">
          <Image
            src="/logo.jpg"
            alt=""
            width={140}
            height={36}
            className="landing-logo"
            priority
          />
          <span className="landing-brand-name">
            {locale === "ar" ? "بوادقجي للتدفئة" : "Bawadkji Heating"}
          </span>
        </Link>
        <div className="landing-header-right">
          <div className="landing-header-actions">
            <div className="landing-header-icons">
              <button
                type="button"
                className="landing-icon-btn"
                onClick={toggleTheme}
                aria-label={theme === "dark" ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن"}
                title={theme === "dark" ? "Light mode" : "Dark mode"}
              >
                <span className="landing-icon-btn-inner" aria-hidden>
                  {theme === "dark" ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="5" />
                      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                  )}
                </span>
              </button>
              <div className="landing-lang-wrap" ref={langDropdownRef}>
                <button
                  type="button"
                  className="landing-icon-btn landing-lang-btn"
                  onClick={() => setLangDropdownOpen((o) => !o)}
                  aria-label="Language"
                  aria-expanded={langDropdownOpen}
                  aria-haspopup="listbox"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <circle cx="12" cy="12" r="10" />
                    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                </button>
                <div className={`landing-lang-dropdown ${langDropdownOpen ? "open" : ""}`} role="listbox">
                  {LANG_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      role="option"
                      aria-selected={locale === opt.value}
                      className={`landing-lang-option ${locale === opt.value ? "active" : ""}`}
                      onClick={() => setLocaleAndClose(opt.value)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="about-page-main">
        <div className="about-page-container container">
          <h1 className="about-page-hero-title">{t.aboutPageTitle}</h1>

          <section className="about-page-section about-section" aria-labelledby="about-heading">
            <h2 id="about-heading" className="about-page-section-title">
              {t.aboutSectionTitle}
            </h2>
            <div className="about-page-section-content">
              <p className="about-page-text">{t.aboutIntro1}</p>
              <p className="about-page-text">{t.aboutIntro2}</p>
            </div>
          </section>

          <section className="about-page-section works-section" aria-labelledby="works-heading">
            <h2 id="works-heading" className="about-page-section-title">
              {t.worksSectionTitle}
            </h2>
            <p className="about-page-works-lead">{t.worksLead}</p>
            <ul className="about-page-works-grid">
              {WORK_KEYS.map((key) => (
                <li key={key} className="about-page-work-card">
                  <span className="about-page-work-icon" aria-hidden>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  <span className="about-page-work-text">{t[key]}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>

      <footer className="landing-footer" role="contentinfo">
        <div className="landing-footer-inner container">
          <div className="landing-footer-main">
            <div className="landing-footer-brand">
              <Image src="/logo.jpg" alt="" width={48} height={48} className="landing-footer-logo-img" />
              <span className="landing-footer-brand-name">{t.footerBrand}</span>
            </div>
            <p className="landing-footer-tagline">{t.footerTagline}</p>
            <p className="landing-footer-address">{t.locationAddress}</p>
          </div>
          <div className="landing-footer-card-wrap">
            <div className="landing-footer-card-parent">
              <div className="landing-footer-card">
                <div className="landing-footer-card-glass">
                  <div className="landing-footer-card-content">
                    <span className="landing-footer-card-title">{t.footerFollow}</span>
                    <span className="landing-footer-card-text">{t.footerTagline}</span>
                  </div>
                  <div className="landing-footer-card-bottom">
                    <div className="landing-footer-card-social">
                      <a
                        href="https://wa.me/963933204343"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="landing-footer-card-social-btn"
                        aria-label="WhatsApp"
                      >
                        <svg
                          className="landing-footer-card-social-svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                      </a>
                      <a
                        href="https://www.facebook.com/BawadkjiHeating"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="landing-footer-card-social-btn"
                        aria-label="Facebook - Bawadkji Heating - بوادقجي للتدفئة"
                      >
                        <svg
                          className="landing-footer-card-social-svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden
                        >
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      </a>
                      <a
                        href="https://www.instagram.com/bawadkji_heating/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="landing-footer-card-social-btn"
                        aria-label="Instagram"
                      >
                        <svg
                          className="landing-footer-card-social-svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden
                        >
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="landing-footer-card-logo">
                  <span className="landing-footer-card-circle landing-footer-card-circle1" />
                  <span className="landing-footer-card-circle landing-footer-card-circle2" />
                  <span className="landing-footer-card-circle landing-footer-card-circle3" />
                  <span className="landing-footer-card-circle landing-footer-card-circle4" />
                  <span className="landing-footer-card-circle landing-footer-card-circle5">
                    <Image src="/logo.jpg" alt="" width={28} height={28} className="landing-footer-card-logo-img" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="landing-footer-copy" suppressHydrationWarning>
          {t.footerRights} © {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
