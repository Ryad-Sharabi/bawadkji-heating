import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "bawadkji-admin";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }
    const secret = new TextEncoder().encode(
      process.env.AUTH_SECRET || "bawadkji-secret-change-in-production"
    );
    const { payload } = await jwtVerify(token, secret);
    const user = {
      id: payload.sub,
      email: payload.email as string,
      name: payload.name as string,
    };
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
