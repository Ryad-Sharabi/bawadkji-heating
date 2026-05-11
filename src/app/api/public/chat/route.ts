import { NextResponse } from "next/server";
import { createGroqChatCompletion } from "@/lib/groq";
import { buildSalesAgentSystemPrompt, buildSalesCatalog } from "@/lib/sales-agent";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatRequest = {
  locale?: string;
  sessionId?: string;
  messages?: ChatMessage[];
};

let cachedCatalog: Awaited<ReturnType<typeof buildSalesCatalog>> | null = null;
let cachedCatalogAt = 0;
const CATALOG_CACHE_MS = 120_000;

function normalizeLocale(locale: string | undefined) {
  return locale === "en" ? "en" : "ar";
}

function getLastUserMessage(messages: ChatMessage[]) {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    if (messages[index]?.role === "user") return messages[index].content.trim();
  }
  return "";
}

async function getSalesCatalog() {
  const now = Date.now();
  if (cachedCatalog && now - cachedCatalogAt < CATALOG_CACHE_MS) return cachedCatalog;

  cachedCatalog = await buildSalesCatalog();
  cachedCatalogAt = now;
  return cachedCatalog;
}

function fallbackReply(locale: "ar" | "en", message: string) {
  const text = message.toLowerCase();
  const includesAny = (terms: string[]) => terms.some((term) => text.includes(term));

  if (includesAny(["product", "منتج", "category", "فئة", "solar", "شمس", "pump", "مضخ", "radiator", "مشع", "ac", "مكيف", "ppr", "pex"])) {
    return locale === "ar"
      ? "يمكنك تصفح المنتجات المتوفرة من الصفحة الرئيسية حسب الفئة. إذا ذكرت الفئة أو اسم المنتج أخبرك إن كان متوفراً حالياً."
      : "Browse available products from the home page by category. Tell me the category or product name and I will check availability.";
  }

  if (includesAny(["contact", "اتصل", "phone", "هاتف", "whatsapp", "واتس", "location", "موقع", "address", "عنوان"])) {
    return locale === "ar"
      ? "موقعنا: سورية، حلب، حي الجميلية، بناء سنتر الاتحاد. للتواصل عبر واتساب: https://wa.me/963933204343"
      : "Our location: Syria, Aleppo, Al-Jamiliya, Union Center Building. WhatsApp: https://wa.me/963933204343";
  }

  return locale === "ar"
    ? "أنا مساعد مبيعات بوادقجي للتدفئة. اسألني عن المنتجات والفئات والتوفر أو كيفية التواصل معنا."
    : "I am the Bawadkji Heating sales assistant. Ask about products, categories, availability, or how to contact us.";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChatRequest;
    const locale = normalizeLocale(body.locale);
    const messages = Array.isArray(body.messages)
      ? body.messages.filter(
          (message): message is ChatMessage =>
            !!message &&
            (message.role === "user" || message.role === "assistant") &&
            typeof message.content === "string" &&
            message.content.trim().length > 0
        )
      : [];

    const lastUserMessage = getLastUserMessage(messages);
    if (!lastUserMessage) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    const catalog = await getSalesCatalog();
    const systemPrompt = buildSalesAgentSystemPrompt(locale, catalog);
    const groqMessages = [
      { role: "system" as const, content: systemPrompt },
      ...messages.slice(-14).map((message) => ({
        role: message.role,
        content: message.content,
      })),
    ];

    const aiReply = await createGroqChatCompletion(groqMessages);
    const reply = aiReply ?? fallbackReply(locale, lastUserMessage);

    return NextResponse.json({
      reply,
      provider: aiReply ? "groq" : "local",
      sessionId: typeof body.sessionId === "string" ? body.sessionId : null,
    });
  } catch {
    return NextResponse.json({ error: "Unable to process chat request." }, { status: 500 });
  }
}
