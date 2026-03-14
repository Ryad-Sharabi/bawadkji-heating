import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { requireAuth } from "@/lib/auth-server";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "products");

export async function POST(request: Request) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "لا يوجد ملف" }, { status: 400 });
    }
    const ext = path.extname(file.name) || ".jpg";
    const name = `${randomUUID()}${ext}`;
    await mkdir(UPLOAD_DIR, { recursive: true });
    const bytes = await file.arrayBuffer();
    const buf = Buffer.from(bytes);
    const dest = path.join(UPLOAD_DIR, name);
    await writeFile(dest, buf);
    const url = `/uploads/products/${name}`;
    return NextResponse.json({ url });
  } catch (e) {
    console.error("Upload error:", e);
    return NextResponse.json({ error: "فشل رفع الملف" }, { status: 500 });
  }
}
