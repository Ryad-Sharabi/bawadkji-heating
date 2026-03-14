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

export async function GET(request: NextRequest) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;
  try {
    const { searchParams } = new URL(request.url);
    const start = Math.max(0, parseInt(searchParams.get("_start") ?? "0", 10));
    const end = Math.max(start, parseInt(searchParams.get("_end") ?? "10", 10));
    const sort = (searchParams.get("_sort") ?? "createdAt").split(",")[0];
    const order = (searchParams.get("_order") ?? "desc").toLowerCase();

    const sortField = ["createdAt", "updatedAt", "name", "category", "available"].includes(sort) ? sort : "createdAt";
    const total = await prisma.product.count();
    const list = await prisma.product.findMany({
      skip: start,
      take: end - start,
      orderBy: { [sortField]: order === "asc" ? "asc" : "desc" },
    });

    const data = list.map((p) => ({
      ...p,
      images: Array.isArray(p.images) ? p.images : parseJsonArray(p.images),
    }));

    return NextResponse.json(data, {
      headers: { "x-total-count": String(total) },
    });
  } catch (e) {
    console.error("Products GET error:", e);
    return NextResponse.json({ error: "فشل جلب المنتجات" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const description = typeof body.description === "string" ? body.description.trim() || null : null;
    const category = typeof body.category === "string" ? body.category.trim() : "";
    const available = typeof body.available === "boolean" ? body.available : true;
    const images = Array.isArray(body.images) ? body.images.filter((x: unknown) => typeof x === "string") : [];

    if (!name) {
      return NextResponse.json({ error: "اسم المنتج مطلوب" }, { status: 400 });
    }
    if (!category) {
      return NextResponse.json({ error: "الفئة مطلوبة" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        category,
        images: images as unknown as string[],
        available,
      },
    });

    return NextResponse.json({
      ...product,
      images: Array.isArray(product.images) ? product.images : parseJsonArray(product.images),
    });
  } catch (e) {
    console.error("Products POST error:", e);
    return NextResponse.json({ error: "فشل إنشاء المنتج" }, { status: 500 });
  }
}
