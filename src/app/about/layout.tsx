import { Metadata } from "next";

export const metadata: Metadata = {
  title: "من نحن وأعمالنا | Bawadkji Heating",
  description: "تعرف على شركة بوادقجي للتدفئة وأبرز أعمالها منذ التأسيس عام 1968.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
