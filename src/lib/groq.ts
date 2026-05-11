type GroqMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type GroqChatResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

export async function createGroqChatCompletion(messages: GroqMessage[]) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.35,
      max_tokens: 700,
      messages,
    }),
  });

  if (!response.ok) {
    console.error("Groq chat error:", response.status, await response.text());
    return null;
  }

  const data = (await response.json()) as GroqChatResponse;
  return data.choices?.[0]?.message?.content?.trim() || null;
}
