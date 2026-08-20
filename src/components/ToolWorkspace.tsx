import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Copy, Loader2, RefreshCw, Save, Sparkles, Wand2 } from "lucide-react";

import { generateWithLuma } from "@/lib/ai.functions";
import { useRecentTools, useSavedWork } from "@/lib/workspace-store";
import { ResponsibleAiNotice } from "@/components/ResponsibleAiNotice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type ToolField = {
  name: string;
  label: string;
  type: "text" | "textarea" | "select";
  placeholder?: string;
  options?: string[];
  required?: boolean;
  hint?: string;
  rows?: number;
  span?: "full" | "half";
};

export type ToolConfig = {
  slug: string;
  title: string;
  system: string;
  fields: ToolField[];
  buildPrompt: (values: Record<string, string>) => string;
  resultLabel: string;
  submitLabel: string;
  emptyState: string;
  refinements?: { label: string; instruction: string }[];
};

const defaultRefinements = [
  { label: "Make it shorter", instruction: "Rewrite this to be noticeably shorter while keeping every essential point." },
  { label: "More professional", instruction: "Rewrite this in a more formal, polished, executive-ready register." },
  { label: "Friendlier", instruction: "Rewrite this with a warmer, more personable tone while staying professional." },
  { label: "More detailed", instruction: "Expand this with more useful specifics, structure and clarity." },
];

export function ToolWorkspace({ config }: { config: ToolConfig }) {
  const generate = useServerFn(generateWithLuma);
  const { save } = useSavedWork();
  const { track } = useRecentTools();
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(config.fields.map((f) => [f.name, f.type === "select" ? (f.options?.[0] ?? "") : ""])),
  );
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [busyLabel, setBusyLabel] = useState<string | null>(null);

  const setValue = (name: string, value: string) => setValues((prev) => ({ ...prev, [name]: value }));

  const run = async (messages: { role: "user" | "assistant"; content: string }[], label: string) => {
    setLoading(true);
    setBusyLabel(label);
    try {
      const res = await generate({ data: { system: config.system, messages } });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      setResult(res.text);
      track(config.slug);
    } catch {
      toast.error("Luma could not be reached. Please try again.");
    } finally {
      setLoading(false);
      setBusyLabel(null);
    }
  };

  const onGenerate = () => {
    const missing = config.fields.filter((f) => f.required && !values[f.name]?.trim());
    if (missing.length) {
      toast.error(`Please complete: ${missing.map((f) => f.label).join(", ")}`);
      return;
    }
    void run([{ role: "user", content: config.buildPrompt(values) }], config.submitLabel);
  };

  const onRefine = (instruction: string, label: string) => {
    void run(
      [
        { role: "user", content: config.buildPrompt(values) },
        { role: "assistant", content: result },
        { role: "user", content: instruction },
      ],
      label,
    );
  };

  const refinements = config.refinements ?? defaultRefinements;

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
      <div className="space-y-6">
        <div className="surface-card p-5 md:p-6">
          <h2 className="text-base font-semibold">Brief Luma</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            The more context you give, the more usable the first draft.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {config.fields.map((field) => (
              <div
                key={field.name}
                className={field.span === "half" ? "sm:col-span-1" : "sm:col-span-2"}
              >
                <Label htmlFor={field.name} className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {field.label}
                  {field.required && <span className="ml-1 text-rose">*</span>}
                </Label>
                <div className="mt-1.5">
                  {field.type === "textarea" && (
                    <Textarea
                      id={field.name}
                      rows={field.rows ?? 4}
                      placeholder={field.placeholder}
                      value={values[field.name] ?? ""}
                      onChange={(e) => setValue(field.name, e.target.value)}
                      className="rounded-xl bg-background"
                    />
                  )}
                  {field.type === "text" && (
                    <Input
                      id={field.name}
                      placeholder={field.placeholder}
                      value={values[field.name] ?? ""}
                      onChange={(e) => setValue(field.name, e.target.value)}
                      className="h-10 rounded-xl bg-background"
                    />
                  )}
                  {field.type === "select" && (
                    <Select value={values[field.name]} onValueChange={(v) => setValue(field.name, v)}>
                      <SelectTrigger id={field.name} className="h-10 rounded-xl bg-background">
                        <SelectValue placeholder="Choose" />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                {field.hint && <p className="mt-1 text-xs text-muted-foreground">{field.hint}</p>}
              </div>
            ))}
          </div>
          <Button
            onClick={onGenerate}
            disabled={loading}
            className="mt-5 h-11 w-full rounded-xl bg-gradient-luma text-primary-foreground shadow-glow hover:opacity-95"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            <span className="ml-2">{loading ? (busyLabel ?? "Working…") : config.submitLabel}</span>
          </Button>
        </div>
        <ResponsibleAiNotice />
      </div>

      <div className="surface-card flex min-h-[520px] flex-col p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold">{config.resultLabel}</h2>
            <p className="text-xs text-muted-foreground">Editable workspace — refine it until it sounds like you.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl"
              disabled={!result || loading}
              onClick={() => onRefine("Regenerate this from scratch with a fresh structure and wording.", "Regenerating…")}
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span className="ml-1.5">Regenerate</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl"
              disabled={!result}
              onClick={() => {
                void navigator.clipboard.writeText(result);
                toast.success("Copied to clipboard");
              }}
            >
              <Copy className="h-3.5 w-3.5" />
              <span className="ml-1.5">Copy</span>
            </Button>
            <Button
              size="sm"
              className="rounded-xl"
              disabled={!result}
              onClick={() => {
                save({ tool: config.title, title: `${config.title} — ${new Date().toLocaleDateString()}`, content: result });
                toast.success("Saved to Saved Work");
              }}
            >
              <Save className="h-3.5 w-3.5" />
              <span className="ml-1.5">Save</span>
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {refinements.map((r) => (
            <Button
              key={r.label}
              variant="secondary"
              size="sm"
              className="rounded-full text-xs"
              disabled={!result || loading}
              onClick={() => onRefine(r.instruction, r.label + "…")}
            >
              <Wand2 className="h-3 w-3" />
              <span className="ml-1.5">{r.label}</span>
            </Button>
          ))}
        </div>

        <div className="mt-4 flex-1">
          {result ? (
            <Textarea
              value={result}
              onChange={(e) => setResult(e.target.value)}
              className="h-full min-h-[380px] resize-none rounded-2xl bg-background text-sm leading-relaxed"
              aria-label={config.resultLabel}
            />
          ) : (
            <div className="flex h-full min-h-[380px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-gradient-soft p-8 text-center">
              {loading ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <p className="mt-3 text-sm text-muted-foreground">{busyLabel ?? "Luma is thinking…"}</p>
                </>
              ) : (
                <>
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-card shadow-soft">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </span>
                  <p className="mt-3 max-w-sm text-sm text-muted-foreground">{config.emptyState}</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
