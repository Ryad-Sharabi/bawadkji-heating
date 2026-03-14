import "@ant-design/v5-patch-for-react-19";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Metadata } from "next";
import React from "react";

import "./landing.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "Floor Heating & Climate Solutions | Comfort Through Innovation",
  description: "Premium underfloor heating and HVAC solutions for homes and businesses worldwide.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={plusJakarta.variable} suppressHydrationWarning>
      <body style={{ margin: 0, minHeight: "100vh", fontFamily: "var(--font-plus-jakarta), system-ui, sans-serif" }} suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function() {
  try {
    var theme = localStorage.getItem('bawadkji-theme');
    var locale = localStorage.getItem('bawadkji-locale');
    var d = document.documentElement;
    if (theme === 'light' || theme === 'dark') d.setAttribute('data-theme', theme);
    if (locale === 'ar') { d.lang = 'ar'; d.dir = 'rtl'; }
    else if (locale === 'en') { d.lang = 'en'; d.dir = 'ltr'; }
  } catch (e) {}
})();
            `.trim(),
          }}
        />
        {children}
      </body>
    </html>
  );
}
