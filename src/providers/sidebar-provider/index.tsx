"use client";

import { createContext, useContext } from "react";

type SidebarContextValue = {
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  showHamburger?: boolean;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function useSidebar() {
  return useContext(SidebarContext);
}

export { SidebarContext };
