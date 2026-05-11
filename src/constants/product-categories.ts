/** نفس فئات الصفحة الرئيسية (LandingPage) */
export const PRODUCT_CATEGORIES = [
  { value: "catSolar", label: "طاقة شمسية" },
  { value: "catBurners", label: "حراقات" },
  { value: "catPumps", label: "مضخات" },
  { value: "catAccessories", label: "اكسسوارات" },
  { value: "catAc", label: "مكيفات" },
  { value: "catRadiators", label: "مشعات" },
  { value: "catPpr", label: "أنابيب P.P.R" },
  { value: "catPex", label: "أنابيب P.E.X" },
  { value: "catHeatingStairs", label: "سلالم تدفئة" },
  { value: "catUnderfloor", label: "التدفئة الأرضية" },
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number]["value"];
