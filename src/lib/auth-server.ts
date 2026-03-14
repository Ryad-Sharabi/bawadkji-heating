/**
 * تحقق من هوية الأدمن على السيرفر (لحماية مسارات الـ API).
 * يقرأ JWT من الكوكي ويُصدّقه باستخدام AUTH_SECRET.
 *
 * Server-side admin auth: read JWT from cookie, verify with AUTH_SECRET.
 */

import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

const COOKIE_NAME = "bawadkji-admin";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
};

/**
 * يقرأ الكوكي ويُصدّق الـ JWT. يُرجع بيانات المستخدم أو null.
 * Reads cookie and verifies JWT. Returns user payload or null.
 */
export async function getAuthUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const secret = new TextEncoder().encode(
      process.env.AUTH_SECRET || "bawadkji-secret-change-in-production"
    );
    const { payload } = await jwtVerify(token, secret);
    return {
      id: String(payload.sub),
      email: String(payload.email),
      name: String(payload.name ?? ""),
    };
  } catch {
    return null;
  }
}

/**
 * يُلزم وجود مستخدم مصادق. إن لم يوجد يُرجع استجابة 401.
 * Use in API routes: const auth = await requireAuth(); if (auth instanceof NextResponse) return auth;
 */
export async function requireAuth(): Promise<AuthUser | NextResponse> {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json(
      { error: "غير مصرح. يرجى تسجيل الدخول." },
      { status: 401 }
    );
  }
  return user;
}
