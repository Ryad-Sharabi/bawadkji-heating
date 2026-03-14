"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useRef, useEffect } from "react";
import type { Locale } from "./translations";

const LANG_OPTIONS: { value: Locale; label: string }[] = [
  { value: "ar", label: "العربية" },
  { value: "en", label: "English" },
];

export type LandingHeaderProps = {
  t: { aboutUs: string; contactUs: string };
  locale: Locale;
  theme: "dark" | "light";
  setTheme: (t: "dark" | "light") => void;
  setLocale: (l: Locale) => void;
  navOpen: boolean;
  setNavOpen: (v: boolean) => void;
};

export function LandingHeader({ t, locale, theme, setTheme, setLocale, navOpen, setNavOpen }: LandingHeaderProps) {
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const [langDropdownOpen, setLangDropdownOpen] = React.useState(false);

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
    if (typeof window !== "undefined") localStorage.setItem("bawadkji-theme", next);
  };

  const setLocaleAndClose = (next: Locale) => {
    setLocale(next);
    setLangDropdownOpen(false);
    if (typeof window !== "undefined") localStorage.setItem("bawadkji-locale", next);
  };

  return (
    <header className="landing-header" dir="ltr">
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
          <nav className={`landing-nav ${navOpen ? "open" : ""}`}>
            <Link href="/about" className="landing-nav-link" onClick={() => setNavOpen(false)}>
              {t.aboutUs}
            </Link>
            <a href="https://wa.me/963933204343" target="_blank" rel="noopener noreferrer" className="landing-nav-link landing-nav-link-primary" onClick={() => setNavOpen(false)}>
              {t.contactUs}
            </a>
          </nav>
        </div>
        <button
          type="button"
          className="landing-menu-btn"
          onClick={() => setNavOpen(!navOpen)}
          aria-label="Toggle menu"
          aria-expanded={navOpen}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {navOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>
    </header>
  );
}
