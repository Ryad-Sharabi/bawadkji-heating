import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@lib/db";
import { requireAuth } from "@/lib/auth-server";

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

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return NextResponse.json({ error: "المنتج غير موجود" }, { status: 404 });
    }
    return NextResponse.json({
      ...product,
      images: Array.isArray(product.images) ? product.images : parseJsonArray(product.images),
    });
  } catch (e) {
    console.error("Product GET error:", e);
    return NextResponse.json({ error: "فشل جلب المنتج" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;
  try {
    const { id } = await params;
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : undefined;
    const description = typeof body.description === "string" ? body.description.trim() || null : undefined;
    const category = typeof body.category === "string" ? body.category.trim() : undefined;
    const available = typeof body.available === "boolean" ? body.available : undefined;
    const images = Array.isArray(body.images) ? body.images.filter((x: unknown) => typeof x === "string") : undefined;

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(category !== undefined && { category }),
        ...(available !== undefined && { available }),
        ...(images !== undefined && { images: images as unknown as string[] }),
      },
    });

    return NextResponse.json({
      ...product,
      images: Array.isArray(product.images) ? product.images : parseJsonArray(product.images),
    });
  } catch (e) {
    console.error("Product PATCH error:", e);
    return NextResponse.json({ error: "فشل تحديث المنتج" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;
  try {
    const { id } = await params;
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ id });
  } catch (e) {
    console.error("Product DELETE error:", e);
    return NextResponse.json({ error: "فشل حذف المنتج" }, { status: 500 });
  }
}
