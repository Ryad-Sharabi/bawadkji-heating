"use client";

import { useEffect, useState, useCallback, useMemo, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PRODUCT_CATEGORIES } from "@constants/product-categories";

type Product = {
  id: string;
  name: string;
  description?: string | null;
  category: string;
  images: string[];
  available: boolean;
};

const categoryMap = Object.fromEntries(PRODUCT_CATEGORIES.map((c) => [c.value, c.label]));

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") ?? "";
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ _start: "0", _end: "48", _sort: "createdAt", _order: "desc" });
      if (categoryParam) params.set("category", categoryParam);
      const res = await fetch(`/api/public/products?${params}`, { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }, [categoryParam]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const categoryLabel = useMemo(
    () => (categoryParam && categoryMap[categoryParam] ? categoryMap[categoryParam] : null),
    [categoryParam]
  );

  return (
    <div className="container" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: 8, color: "var(--text-primary, #fff)" }}>
          {categoryLabel ? categoryLabel : "المنتجات"}
        </h1>
        <p style={{ color: "var(--text-muted, #94a3b8)", margin: 0 }}>
          {categoryLabel ? `منتجات الفئة: ${categoryLabel}` : "تصفح جميع المنتجات المتوفرة"}
        </p>
      </div>

      {!categoryParam && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
          <Link
            href="/products"
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              background: "var(--brand-red, #e61e26)",
              color: "#fff",
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            الكل
          </Link>
          {PRODUCT_CATEGORIES.map((cat) => (
            <Link
              key={cat.value}
              href={`/products?category=${cat.value}`}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                background: "var(--glass-bg, rgba(255,255,255,0.06))",
                color: "var(--text-muted, #94a3b8)",
                textDecoration: "none",
                fontSize: 14,
                border: "1px solid var(--glass-border, rgba(255,255,255,0.12))",
              }}
            >
              {cat.label}
            </Link>
          ))}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: 48, color: "var(--text-muted)" }}>جاري التحميل...</div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: "center", padding: 48, color: "var(--text-muted)" }}>
          لا توجد منتجات في هذه الفئة.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 24,
          }}
        >
          {products.map((p) => (
            <article
              key={p.id}
              style={{
                background: "var(--glass-bg, rgba(255,255,255,0.06))",
                borderRadius: 12,
                border: "1px solid var(--glass-border, rgba(255,255,255,0.12))",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  aspectRatio: "4/3",
                  position: "relative",
                  background: "var(--landing-dark-bg-alt, #1e293b)",
                }}
              >
                {Array.isArray(p.images) && p.images[0] ? (
                  <Image
                    src={p.images[0]}
                    alt={p.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 260px"
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--text-muted)",
                      fontSize: 14,
                    }}
                  >
                    لا صورة
                  </div>
                )}
              </div>
              <div style={{ padding: 16, flex: 1, display: "flex", flexDirection: "column" }}>
                <span
                  style={{
                    fontSize: 12,
                    color: "var(--brand-red, #e61e26)",
                    marginBottom: 4,
                  }}
                >
                  {categoryMap[p.category] ?? p.category}
                </span>
                <h2
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    margin: "0 0 8px",
                    color: "var(--text-primary, #fff)",
                    lineHeight: 1.3,
                  }}
                >
                  {p.name}
                </h2>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--text-muted)",
                    margin: 0,
                    flex: 1,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {p.description || ""}
                </p>
                <Link
                  href={`/products/${p.id}`}
                  style={{
                    marginTop: 12,
                    display: "inline-block",
                    padding: "10px 16px",
                    borderRadius: 8,
                    background: "var(--brand-red, #e61e26)",
                    color: "#fff",
                    textDecoration: "none",
                    fontSize: 14,
                    fontWeight: 500,
                    textAlign: "center",
                  }}
                >
                  تفاصيل
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: "center", padding: 48, color: "var(--text-muted)" }}>جاري التحميل...</div>}>
      <ProductsPageContent />
    </Suspense>
  );
}
