import { NextResponse } from "next/server";
import * as bcrypt from "bcrypt";
import { SignJWT } from "jose";
import { prisma } from "@/lib/db";

const COOKIE_NAME = "bawadkji-admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body as { email?: string; password?: string };
    if (!email || !password) {
      return NextResponse.json(
        { error: "البريد وكلمة السر مطلوبان" },
        { status: 400 }
      );
    }
    const user = await prisma.user.findUnique({ where: { email: email.trim() } });
    if (!user) {
      return NextResponse.json(
        { error: "البريد أو كلمة السر غير صحيحة" },
        { status: 401 }
      );
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json(
        { error: "البريد أو كلمة السر غير صحيحة" },
        { status: 401 }
      );
    }
    const secret = new TextEncoder().encode(
      process.env.AUTH_SECRET || "bawadkji-secret-change-in-production"
    );
    const token = await new SignJWT({
      sub: user.id,
      email: user.email,
      name: user.name,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(secret);

    const res = NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name },
    });
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: MAX_AGE,
      path: "/",
    });
    return res;
  } catch (e) {
    console.error("Login error:", e);
    return NextResponse.json(
      { error: "حدث خطأ أثناء تسجيل الدخول" },
      { status: 500 }
    );
  }
}
