import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@lib/db";

function parseJsonArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((x): x is string => typeof x === "string");
  if (typeof value === "string") {
    try {
      const arr = JSON.parse(value);
      return Array.isArray(arr) ? arr.filter((x): x is string => typeof x === "string") : [];
    } catch {
      return [];
    }
  }
  return [];
}

/** تفاصيل منتج واحد للعرض العام (بدون مصادقة) — يُرجع 404 إذا غير متوفر */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findFirst({
      where: { id, available: true },
    });
    if (!product) {
      return NextResponse.json({ error: "المنتج غير موجود" }, { status: 404 });
    }
    return NextResponse.json({
      ...product,
      images: Array.isArray(product.images) ? product.images : parseJsonArray(product.images),
    });
  } catch (e) {
    console.error("Public product GET error:", e);
    return NextResponse.json({ error: "فشل جلب المنتج" }, { status: 500 });
  }
}
