import { PRODUCT_CATEGORIES } from "@constants/product-categories";
import { translations } from "@/components/landing/translations";
import { prisma } from "@/lib/db";

const COMPANY_WHATSAPP = "963933204343";
const COMPANY_LOCATION_AR = "سورية، حلب، حي الجميلية، بناء سنتر الاتحاد";
const COMPANY_LOCATION_EN = "Syria, Aleppo, Al-Jamiliya, Union Center Building";

type CatalogProduct = {
  id: string;
  name: string;
  category: string;
  categoryLabelAr: string;
  categoryLabelEn: string;
  available: boolean;
  description: string;
};

function truncate(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trim()}…`;
}

export async function buildSalesCatalog() {
  const categoryMap = Object.fromEntries(PRODUCT_CATEGORIES.map((category) => [category.value, category]));

  const products = await prisma.product.findMany({
    orderBy: [{ available: "desc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      description: true,
      category: true,
      available: true,
    },
  });

  const catalog: CatalogProduct[] = products.map((product) => {
    const category = categoryMap[product.category as keyof typeof categoryMap];
    const categoryKey = product.category as keyof typeof translations.ar;
    return {
      id: product.id,
      name: product.name,
      category: product.category,
      categoryLabelAr: translations.ar[categoryKey] ?? category?.label ?? product.category,
      categoryLabelEn: translations.en[categoryKey] ?? category?.label ?? product.category,
      available: product.available,
      description: truncate((product.description ?? "").trim(), 420),
    };
  });

  const categories = PRODUCT_CATEGORIES.map((category) => ({
    id: category.value,
    labelAr: translations.ar[category.value],
    labelEn: translations.en[category.value],
    availableCount: catalog.filter((product) => product.category === category.value && product.available).length,
    totalCount: catalog.filter((product) => product.category === category.value).length,
  }));

  return { catalog, categories };
}

export function buildSalesAgentSystemPrompt(
  locale: "ar" | "en",
  catalog: Awaited<ReturnType<typeof buildSalesCatalog>>
) {
  const location = locale === "ar" ? COMPANY_LOCATION_AR : COMPANY_LOCATION_EN;
  const languageRule =
    locale === "ar"
      ? "اكتب كل الردود بالعربية الفصحى الواضحة."
      : "Write every reply in clear English.";

  return [
    "You are the Bawadkji Heating sales assistant for a heating, HVAC, and solar company in Aleppo, Syria.",
    languageRule,
    "Act like a helpful sales agent: recommend products, explain categories, answer follow-up questions, and guide the customer toward the right solution.",
    "Use only the catalog and categories provided below. Never invent products, prices, stock, or specifications.",
    "If a product exists but available=false, clearly say it is not currently available and do not present it as purchasable.",
    "If a product is available=true, you may discuss its name, category, and description and help the customer compare options.",
    "If the customer asks about a category, summarize what is available in that category from the catalog.",
    "If nothing matches, say so honestly and suggest the closest available category or invite the customer to contact the company.",
    `Company location: ${location}`,
    `WhatsApp: https://wa.me/${COMPANY_WHATSAPP}`,
    "Keep answers concise, friendly, and practical.",
    "Catalog JSON:",
    JSON.stringify(catalog.catalog),
    "Categories JSON:",
    JSON.stringify(catalog.categories),
  ].join("\n");
}
