"use client";

import { useEffect, useState, useCallback, useMemo, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PRODUCT_CATEGORIES } from "@constants/product-categories";
import { usePublicLocale } from "@components/landing/PublicLocaleContext";
import { translations } from "@components/landing/translations";

type Product = {
  id: string;
  name: string;
  description?: string | null;
  category: string;
  images: string[];
  available: boolean;
};

const categoryMap = Object.fromEntries(PRODUCT_CATEGORIES.map((c) => [c.value, c.label]));
const FALLBACK_IMAGE = "/logo.jpg";

function ProductCardImage({ src, alt }: { src?: string; alt: string }) {
  const [imgSrc, setImgSrc] = useState(src || FALLBACK_IMAGE);

  useEffect(() => {
    setImgSrc(src || FALLBACK_IMAGE);
  }, [src]);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      sizes="(max-width: 520px) 100vw, (max-width: 900px) 50vw, (max-width: 1200px) 33vw, 25vw"
      className="products-catalog-card-image"
      unoptimized
      onError={() => setImgSrc(FALLBACK_IMAGE)}
    />
  );
}

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") ?? "";
  const locale = usePublicLocale();
  const t = translations[locale];
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

  const getCategoryLabel = useCallback(
    (value: string) => {
      const key = value as keyof typeof t;
      if (typeof t[key] === "string") return t[key] as string;
      return categoryMap[value] ?? value;
    },
    [t]
  );

  const categoryLabel = useMemo(
    () => (categoryParam ? getCategoryLabel(categoryParam) : null),
    [categoryParam, getCategoryLabel]
  );

  const pageTitle = categoryLabel ?? t.productsListTitle;

  return (
    <section className="products-catalog section" aria-label={pageTitle}>
      <div className="container products-catalog-container">
        <header className="products-catalog-header">
          <Link href="/#categories" className="products-catalog-back">
            {t.productsBackCategories}
          </Link>
          <p className="products-catalog-kicker">{t.categoriesSubtitle}</p>
          <h1 className="products-catalog-title">{pageTitle}</h1>
        </header>

        {loading ? (
          <div className="products-catalog-state" aria-busy="true" aria-live="polite">
            <p>{t.productsLoading}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="products-catalog-state">
            <p>{t.productsEmpty}</p>
            <Link href="/#categories" className="products-catalog-details">
              {t.productsBackCategories}
            </Link>
          </div>
        ) : (
          <div className="products-catalog-grid">
            {products.map((product) => (
              <article key={product.id} className="products-catalog-card">
                <Link href={`/products/${product.id}`} className="products-catalog-card-media" aria-label={product.name}>
                  {Array.isArray(product.images) && product.images[0] ? (
                    <ProductCardImage src={product.images[0]} alt={product.name} />
                  ) : (
                    <div className="products-catalog-card-placeholder">{t.productsNoImage}</div>
                  )}
                </Link>
                <div className="products-catalog-card-body">
                  <span className="products-catalog-card-badge">{getCategoryLabel(product.category)}</span>
                  <h2 className="products-catalog-card-title">
                    <Link href={`/products/${product.id}`}>{product.name}</Link>
                  </h2>
                  {product.description ? <p className="products-catalog-card-desc">{product.description}</p> : null}
                  <Link href={`/products/${product.id}`} className="products-catalog-details">
                    {t.productsDetails}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ProductsPageFallback() {
  const locale = usePublicLocale();
  const t = translations[locale];

  return (
    <section className="products-catalog section" aria-busy="true">
      <div className="container products-catalog-container">
        <div className="products-catalog-state">
          <p>{t.productsLoading}</p>
        </div>
      </div>
    </section>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsPageFallback />}>
      <ProductsPageContent />
    </Suspense>
  );
}
