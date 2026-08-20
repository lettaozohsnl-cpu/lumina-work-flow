import { ShieldCheck } from "lucide-react";

export function ResponsibleAiNotice({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <p className="flex items-start gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
        <span>
          Luma can make mistakes. Review AI output before using it professionally, and only enter confidential
          information where your company policy allows.
        </span>
      </p>
    );
  }

  return (
    <section
      aria-label="Responsible AI notice"
      className="surface-card p-5 md:p-6"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
          <ShieldCheck className="h-4.5 w-4.5" />
        </span>
        <div className="space-y-2">
          <h2 className="text-base font-semibold">Responsible AI at work</h2>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            <li>AI can make mistakes — treat every draft as a starting point, never a final answer.</li>
            <li>Verify facts, names, figures and dates before sharing anything externally.</li>
            <li>
              Only enter confidential or sensitive workplace information in line with your organisation&apos;s data
              policy.
            </li>
            <li>Luma is here to support your professional judgement, not replace it.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
