import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Copy, Star } from "lucide-react";

import { PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useFavorites } from "@/lib/workspace-store";
import { toolItems } from "@/lib/nav";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/templates")({
  head: () => ({
    meta: [
      { title: "Templates & Saved Prompts — LumaDesk AI" },
      {
        name: "description",
        content: "Reusable workplace prompt templates for emails, meetings, planning and research — ready to adapt.",
      },
      { property: "og:title", content: "Templates & Saved Prompts — LumaDesk AI" },
      { property: "og:description", content: "Reusable AI prompt templates for professional work." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Templates,
});

const templates = [
  {
    category: "Email Studio",
    to: "/email-studio",
    title: "Stakeholder progress update",
    prompt:
      "Write a confident progress update to senior stakeholders covering what shipped, what slipped, the impact, and the decision I need from them.",
  },
  {
    category: "Email Studio",
    to: "/email-studio",
    title: "Diplomatic pushback on scope",
    prompt:
      "Write a diplomatic email declining an additional request this quarter, offering one alternative and protecting the existing commitments.",
  },
  {
    category: "Meeting Intelligence",
    to: "/meeting-intelligence",
    title: "Leadership sync brief",
    prompt: "Summarise these notes for leadership: decisions, owners, deadlines, risks and the three things needing a decision.",
  },
  {
    category: "Work Planner",
    to: "/work-planner",
    title: "Programme launch in 6 weeks",
    prompt:
      "Break a six-week internal programme launch into phased tasks with priorities, effort estimates, dependencies and weekly milestones.",
  },
  {
    category: "Work Planner",
    to: "/work-planner",
    title: "Quarterly goal breakdown",
    prompt: "Turn my quarterly goal into monthly milestones, weekly focus blocks and a short list of what to stop doing.",
  },
  {
    category: "Research Hub",
    to: "/research-hub",
    title: "Vendor comparison brief",
    prompt:
      "Structure a vendor comparison: evaluation criteria, key questions per vendor, comparison table, gaps in my evidence and a recommendation format.",
  },
  {
    category: "Luma AI",
    to: "/luma",
    title: "Prepare for a difficult conversation",
    prompt: "Help me prepare for a difficult conversation with a colleague: my goals, their likely position, three framings and my opening line.",
  },
  {
    category: "Luma AI",
    to: "/luma",
    title: "Executive one-minute summary",
    prompt: "Turn this long update into a one-minute spoken summary for an executive, leading with the decision needed.",
  },
];

function Templates() {
  const { favorites, toggle } = useFavorites();

  return (
    <>
      <PageHeader
        badge="Templates"
        title="Reusable prompts for real work"
        description="Start from a proven brief instead of a blank page — copy it, adapt it, and run it in the matching tool."
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {toolItems.map((tool) => (
          <button
            key={tool.slug}
            onClick={() => toggle(tool.slug)}
            className={cn(
              "flex items-center gap-2 rounded-full border border-border px-3.5 py-1.5 text-xs font-medium transition-colors",
              favorites.includes(tool.slug) ? "bg-accent text-accent-foreground" : "bg-card text-muted-foreground",
            )}
          >
            <Star className={cn("h-3.5 w-3.5", favorites.includes(tool.slug) && "fill-current text-gold")} />
            {tool.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {templates.map((t) => (
          <article key={t.title} className="surface-card flex flex-col p-5">
            <Badge variant="secondary" className="w-fit rounded-full bg-secondary text-secondary-foreground">
              {t.category}
            </Badge>
            <h2 className="mt-3 text-base font-semibold">{t.title}</h2>
            <p className="mt-2 flex-1 text-sm text-muted-foreground">{t.prompt}</p>
            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl"
                onClick={() => {
                  void navigator.clipboard.writeText(t.prompt);
                  toast.success("Prompt copied");
                }}
              >
                <Copy className="h-3.5 w-3.5" />
                <span className="ml-1.5">Copy</span>
              </Button>
              <Button asChild size="sm" className="rounded-xl">
                <Link to={t.to}>Open tool</Link>
              </Button>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
