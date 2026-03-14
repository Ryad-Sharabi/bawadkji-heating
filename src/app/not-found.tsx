import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        fontFamily: "var(--font-plus-jakarta), system-ui, sans-serif",
        background: "var(--landing-dark-bg, #0f172a)",
        color: "#fff",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: 8 }}>404</h1>
      <p style={{ color: "var(--text-muted, #94a3b8)", marginBottom: 24 }}>الصفحة غير موجودة</p>
      <Link
        href="/"
        style={{
          padding: "10px 20px",
          background: "#e61e26",
          color: "#fff",
          textDecoration: "none",
          borderRadius: 8,
          fontWeight: 500,
        }}
      >
        العودة للرئيسية
      </Link>
    </div>
  );
}
