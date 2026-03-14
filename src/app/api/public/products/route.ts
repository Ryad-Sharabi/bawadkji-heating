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

/** قائمة المنتجات المتوفرة للعرض العام (بدون مصادقة) */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const start = Math.max(0, parseInt(searchParams.get("_start") ?? "0", 10));
    const end = Math.max(start, parseInt(searchParams.get("_end") ?? "12", 10));
    const sort = (searchParams.get("_sort") ?? "createdAt").split(",")[0];
    const order = (searchParams.get("_order") ?? "desc").toLowerCase();
    const category = searchParams.get("category")?.trim() ?? undefined;

    const sortField = ["createdAt", "updatedAt", "name", "category"].includes(sort) ? sort : "createdAt";
    const where = { available: true, ...(category ? { category } : {}) };

    const total = await prisma.product.count({ where });
    const list = await prisma.product.findMany({
      where,
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
    console.error("Public products GET error:", e);
    return NextResponse.json({ error: "فشل جلب المنتجات" }, { status: 500 });
  }
}
