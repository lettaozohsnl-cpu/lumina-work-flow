import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { Loader2, SendHorizonal, Sparkles } from "lucide-react";

import { PageHeader } from "@/components/AppShell";
import { ResponsibleAiNotice } from "@/components/ResponsibleAiNotice";
import { generateWithLuma, type LumaMessage } from "@/lib/ai.functions";
import { useRecentTools } from "@/lib/workspace-store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/luma")({
  head: () => ({
    meta: [
      { title: "Luma AI Assistant — LumaDesk AI" },
      {
        name: "description",
        content:
          "Brainstorm, improve writing, summarise information, plan projects and solve workplace problems with the Luma AI assistant.",
      },
      { property: "og:title", content: "Luma AI Assistant — LumaDesk AI" },
      { property: "og:description", content: "A calm, capable AI thinking partner for your working day." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LumaChat,
});

const SYSTEM =
  "You are Luma, a warm, sharp AI assistant inside the LumaDesk AI workplace productivity platform. You help professionals brainstorm, improve writing, summarise, plan, and solve workplace problems. Be concise and practical, use markdown headings and bullets where helpful, ask one clarifying question when the request is genuinely ambiguous, and never invent facts, figures or sources.";

const starters = [
  "Help me prepare talking points for a difficult salary conversation.",
  "Summarise this update for an executive audience.",
  "Brainstorm five ways to reduce our reporting workload.",
  "Improve the clarity and tone of a message I need to send today.",
];

function LumaChat() {
  const generate = useServerFn(generateWithLuma);
  const { track } = useRecentTools();
  const [messages, setMessages] = useState<LumaMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const next: LumaMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await generate({ data: { system: SYSTEM, messages: next } });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      setMessages([...next, { role: "assistant", content: res.text }]);
      track("luma");
    } catch {
      toast.error("Luma could not be reached. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        badge="Luma AI Assistant"
        title="Think it through with Luma"
        description="Your conversational partner for writing, planning, summarising and untangling workplace problems."
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="surface-card flex min-h-[600px] flex-col overflow-hidden">
          <div className="flex-1 space-y-5 overflow-y-auto p-5 md:p-6">
            {messages.length === 0 && (
              <div className="flex h-full min-h-[380px] flex-col items-center justify-center rounded-2xl bg-gradient-soft p-8 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-luma text-primary-foreground shadow-glow">
                  <Sparkles className="h-5 w-5" />
                </span>
                <h2 className="mt-4 text-display text-lg">How can I help you today?</h2>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Ask anything about your work — or start with one of these.
                </p>
                <div className="mt-5 grid w-full max-w-lg gap-2">
                  {starters.map((s) => (
                    <button
                      key={s}
                      onClick={() => void send(s)}
                      className="rounded-xl border border-border bg-card px-4 py-2.5 text-left text-sm transition-colors hover:border-primary/40 hover:bg-secondary"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={cn("flex gap-3", m.role === "user" && "justify-end")}>
                {m.role === "assistant" && (
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-luma text-primary-foreground">
                    <Sparkles className="h-4 w-4" />
                  </span>
                )}
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-3 text-sm",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground",
                  )}
                >
                  {m.role === "assistant" ? (
                    <div className="prose-luma">
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                Luma is thinking…
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="border-t border-border bg-card p-4">
            <div className="flex items-end gap-2">
              <Textarea
                value={input}
                rows={2}
                placeholder="Ask Luma anything about your work…"
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void send(input);
                  }
                }}
                className="min-h-[52px] resize-none rounded-xl bg-background"
                aria-label="Message Luma"
              />
              <Button
                onClick={() => void send(input)}
                disabled={loading || !input.trim()}
                className="h-[52px] rounded-xl bg-gradient-luma px-4 text-primary-foreground shadow-glow hover:opacity-95"
                aria-label="Send message"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendHorizonal className="h-4 w-4" />}
              </Button>
            </div>
            <div className="mt-3">
              <ResponsibleAiNotice compact />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <ResponsibleAiNotice />
          <div className="surface-card p-5">
            <h2 className="text-base font-semibold">Works well for</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>Sharpening a message before you send it</li>
              <li>Pressure-testing an idea or recommendation</li>
              <li>Summarising long updates into decisions</li>
              <li>Planning your week around real priorities</li>
              <li>Preparing for difficult conversations</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
