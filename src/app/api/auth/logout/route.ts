import { NextResponse } from "next/server";

const COOKIE_NAME = "bawadkji-admin";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
  });
  return res;
}
