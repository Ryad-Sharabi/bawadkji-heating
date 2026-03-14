"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
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

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [selectedImage, setSelectedImage] = useState(0);

  const fetchProduct = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/public/products/${id}`, { cache: "no-store" });
      if (!res.ok) {
        setProduct(null);
        return;
      }
      const data = await res.json();
      setProduct(data);
      setSelectedImage(0);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  if (!id) return null;
  if (loading) {
    return (
      <div className="container" style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px", textAlign: "center", paddingTop: 48 }}>
        <p style={{ color: "var(--text-muted)" }}>جاري التحميل...</p>
      </div>
    );
  }
  if (!product) {
    return (
      <div className="container" style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px", paddingTop: 48 }}>
        <p style={{ color: "var(--text-muted)", marginBottom: 16 }}>المنتج غير موجود.</p>
        <Link href="/products" style={{ color: "var(--brand-red, #e61e26)", textDecoration: "underline" }}>
          العودة للمنتجات
        </Link>
      </div>
    );
  }

  const images = Array.isArray(product.images) ? product.images : [];
  const mainImage = images[selectedImage] ?? images[0];

  return (
    <div className="container" style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px 48px" }}>
      <Link
        href="/products"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          color: "var(--text-muted)",
          textDecoration: "none",
          fontSize: 14,
          marginBottom: 24,
        }}
      >
        ← العودة للمنتجات
      </Link>

      <div className="products-detail-grid">
        <div style={{ position: "sticky", top: 88 }}>
          <div
            style={{
              aspectRatio: "1",
              position: "relative",
              borderRadius: 12,
              overflow: "hidden",
              background: "var(--landing-dark-bg-alt, #1e293b)",
              marginBottom: 12,
            }}
          >
            {mainImage ? (
              <Image
                src={mainImage}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
                priority
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
                }}
              >
                لا صورة
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {images.map((src, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedImage(i)}
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 8,
                    overflow: "hidden",
                    border: selectedImage === i ? "2px solid var(--brand-red, #e61e26)" : "1px solid var(--glass-border)",
                    padding: 0,
                    cursor: "pointer",
                    background: "var(--landing-dark-bg-alt)",
                  }}
                >
                  <Image src={src} alt="" width={56} height={56} style={{ objectFit: "cover" }} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <span
            style={{
              fontSize: 13,
              color: "var(--brand-red, #e61e26)",
              marginBottom: 8,
              display: "block",
            }}
          >
            {categoryMap[product.category] ?? product.category}
          </span>
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 700,
              margin: "0 0 16px",
              color: "var(--text-primary, #fff)",
              lineHeight: 1.3,
            }}
          >
            {product.name}
          </h1>
          {product.description && (
            <div
              style={{
                color: "var(--text-muted)",
                lineHeight: 1.7,
                whiteSpace: "pre-wrap",
              }}
            >
              {product.description}
            </div>
          )}
          <a
            href="https://wa.me/963933204343"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              marginTop: 24,
              padding: "12px 24px",
              borderRadius: 8,
              background: "#25D366",
              color: "#fff",
              textDecoration: "none",
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            استفسار عبر واتساب
          </a>
        </div>
      </div>
    </div>
  );
}
