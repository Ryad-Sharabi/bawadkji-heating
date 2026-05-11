"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { FloatingChatGridLoader } from "./FloatingChatGridLoader";
import { FloatingChatMascot } from "./FloatingChatMascot";
import { translations, type Locale } from "./translations";

const LOCALE_KEY = "bawadkji-locale";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export function FloatingAiChat() {
  const pathname = usePathname();
  const [locale, setLocale] = useState<Locale>("ar");
  const [chatOpen, setChatOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const submittingRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const syncLocale = () => {
      const savedLocale = localStorage.getItem(LOCALE_KEY) as Locale | null;
      if (savedLocale === "ar" || savedLocale === "en") setLocale(savedLocale);
    };

    syncLocale();
    window.addEventListener("storage", syncLocale);
    window.addEventListener("bawadkji-locale-change", syncLocale);

    return () => {
      window.removeEventListener("storage", syncLocale);
      window.removeEventListener("bawadkji-locale-change", syncLocale);
    };
  }, []);

  const createIntroMessage = (nextLocale: Locale): ChatMessage => ({
    role: "assistant",
    content: translations[nextLocale].floatingChatIntro,
  });

  const resetSession = (nextLocale: Locale = locale) => {
    submittingRef.current = false;
    setSessionId(null);
    setInput("");
    setLoading(false);
    setMessages([createIntroMessage(nextLocale)]);
  };

  const openChat = () => {
    setSessionId(crypto.randomUUID());
    setInput("");
    setLoading(false);
    setMessages([createIntroMessage(locale)]);
    setChatOpen(true);
  };

  const closeChat = () => {
    setChatOpen(false);
    resetSession();
  };

  useEffect(() => {
    if (chatOpen) return;
    setMessages([createIntroMessage(locale)]);
  }, [locale, chatOpen]);

  useEffect(() => {
    if (!chatOpen) return;
    const container = messagesContainerRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  }, [chatOpen, messages, loading]);

  useEffect(() => {
    if (!chatOpen) return;
    inputRef.current?.focus({ preventScroll: true });
  }, [chatOpen]);

  if (pathname?.startsWith("/admin")) return null;

  const t = translations[locale];
  const isAr = locale === "ar";

  const submitMessage = async () => {
    const content = input.trim();
    if (!chatOpen || !content || submittingRef.current) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content }];
    submittingRef.current = true;
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 45_000);

    try {
      const response = await fetch("/api/public/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale, sessionId, messages: nextMessages }),
        signal: controller.signal,
      });

      if (!response.ok) throw new Error("chat_failed");

      const data = (await response.json()) as { reply?: string };
      const reply = data.reply?.trim() || t.floatingChatError;
      setMessages((current) => [...current, { role: "assistant", content: reply }]);
    } catch {
      setMessages((current) => [...current, { role: "assistant", content: t.floatingChatError }]);
    } finally {
      window.clearTimeout(timeoutId);
      submittingRef.current = false;
      setLoading(false);
    }
  };

  const sendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submitMessage();
  };

  return (
    <div className="floating-chat" dir={isAr ? "rtl" : "ltr"}>
      <section
        id="floating-chat-panel"
        className={`floating-chat-panel${chatOpen ? " is-open" : ""}`}
        aria-hidden={!chatOpen}
        aria-label={t.floatingChatTitle}
      >
        <header className="floating-chat-panel-header">
          <div>
            <p className="floating-chat-panel-kicker">{t.floatingChatTitle}</p>
            <p className="floating-chat-panel-subtitle">{t.floatingChatSubtitle}</p>
          </div>
          <button
            type="button"
            className="floating-chat-close"
            onClick={closeChat}
            aria-label={t.floatingChatClose}
          >
            ×
          </button>
        </header>

        <div ref={messagesContainerRef} className="floating-chat-messages" role="log" aria-live="polite">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`floating-chat-message floating-chat-message-${message.role}`}
            >
              {message.content}
            </div>
          ))}
          {loading ? (
            <div className="floating-chat-message floating-chat-message-assistant is-typing">
              <FloatingChatGridLoader label={t.floatingChatTyping} />
            </div>
          ) : null}
        </div>

        <form className="floating-chat-form" onSubmit={sendMessage}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={t.floatingChatPlaceholder}
            className="floating-chat-input"
            autoComplete="off"
          />
          <button
            type="submit"
            className="floating-chat-send"
            disabled={!input.trim()}
            aria-busy={loading}
          >
            {loading ? <FloatingChatGridLoader label={t.floatingChatTyping} compact /> : t.floatingChatSend}
          </button>
        </form>
      </section>

      <button
        type="button"
        className={`floating-chat-trigger tooltip-container${chatOpen ? " is-open" : ""}`}
        onClick={() => {
          if (!chatOpen) openChat();
        }}
        aria-expanded={chatOpen}
        aria-hidden={chatOpen}
        tabIndex={chatOpen ? -1 : 0}
        aria-controls="floating-chat-panel"
        aria-label={t.floatingChatLabel}
      >
        <span className="tooltip floating-chat-tooltip" aria-hidden>
          <span className="floating-chat-tooltip-text">{t.floatingChatTooltip}</span>
        </span>
        <FloatingChatMascot />
        <span className="floating-chat-label">{t.floatingChatLabel}</span>
      </button>
    </div>
  );
}
