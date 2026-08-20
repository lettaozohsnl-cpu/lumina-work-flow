import { createServerFn } from "@tanstack/react-start";

export type LumaMessage = { role: "user" | "assistant"; content: string };

export const generateWithLuma = createServerFn({ method: "POST" })
  .inputValidator((data: { system: string; messages: LumaMessage[] }) => {
    if (!data || typeof data.system !== "string" || !Array.isArray(data.messages)) {
      throw new Error("Invalid request");
    }
    return {
      system: data.system.slice(0, 6000),
      messages: data.messages.slice(-24).map((m) => ({
        role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
        content: String(m.content ?? "").slice(0, 20000),
      })),
    };
  })
  .handler(async ({ data }) => {
    const { callGateway, AiError } = await import("./ai.server");
    try {
      const text = await callGateway([{ role: "system", content: data.system }, ...data.messages]);
      return { ok: true as const, text };
    } catch (error) {
      if (error instanceof AiError) {
        return { ok: false as const, status: error.status, error: error.message };
      }
      return { ok: false as const, status: 500, error: "Something went wrong reaching Luma AI." };
    }
  });
