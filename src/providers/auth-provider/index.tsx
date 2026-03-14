"use client";

import type { AuthProvider } from "@refinedev/core";

const API = "";

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    const res = await fetch(`${API}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });
    const data = await res.json().catch(() => ({}));
    if (res.status !== 200) {
      return { success: false, error: data.error || "فشل تسجيل الدخول" };
    }
    return { success: true, redirectTo: "/admin" };
  },
  logout: async () => {
    await fetch(`${API}/api/auth/logout`, { method: "POST", credentials: "include" });
    return { success: true, redirectTo: "/admin/login" };
  },
  check: async () => {
    const res = await fetch(`${API}/api/auth/me`, { credentials: "include" });
    const data = await res.json().catch(() => ({}));
    if (data?.user) {
      return { authenticated: true };
    }
    return { authenticated: false, redirectTo: "/admin/login", logout: true };
  },
  getIdentity: async () => {
    const res = await fetch(`${API}/api/auth/me`, { credentials: "include" });
    const data = await res.json().catch(() => ({}));
    return data?.user ?? null;
  },
  onError: async (error: { status?: number; response?: { status?: number } }) => {
    const status = error?.status ?? error?.response?.status;
    if (status === 401 || status === 403) {
      return { redirectTo: "/admin/login", logout: true };
    }
    return {};
  },
};
