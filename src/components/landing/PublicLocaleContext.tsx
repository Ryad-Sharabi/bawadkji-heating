"use client";

import React, { createContext, useContext } from "react";
import type { Locale } from "./translations";

type PublicLocaleContextValue = {
  locale: Locale;
};

const PublicLocaleContext = createContext<PublicLocaleContextValue>({ locale: "ar" });

export function PublicLocaleProvider({
  locale,
  children,
}: React.PropsWithChildren<{ locale: Locale }>) {
  return <PublicLocaleContext.Provider value={{ locale }}>{children}</PublicLocaleContext.Provider>;
}

export function usePublicLocale() {
  return useContext(PublicLocaleContext).locale;
}
