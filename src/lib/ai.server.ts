const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3.7-flash";

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export class AiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function callGateway(messages: ChatMessage[]): Promise<string> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) {
    throw new AiError(401, "AI is not configured for this workspace (missing API key).");
  }

  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "fetch",
    },
    body: JSON.stringify({ model: MODEL, messages }),
  });

  if (!res.ok) {
    let message = `AI request failed (${res.status}).`;
    try {
      const body = (await res.json()) as { message?: string; title?: string; error?: { message?: string } };
      message = body.error?.message ?? body.message ?? body.title ?? message;
    } catch {
      /* keep default message */
    }
    if (res.status === 429) message = "Luma is handling a lot of requests right now — please try again in a moment.";
    throw new AiError(res.status, message);
  }

  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new AiError(502, "Luma returned an empty response. Please try again.");
  return text;
}
