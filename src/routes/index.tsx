import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, CalendarClock, CheckCircle2, Clock, Sparkles, TrendingUp } from "lucide-react";

import heroTexture from "@/assets/luma-hero.jpg";
import { PageHeader } from "@/components/AppShell";
import { ResponsibleAiNotice } from "@/components/ResponsibleAiNotice";
import { navBySlug, toolItems } from "@/lib/nav";
import { useFavorites, useRecentTools, useSavedWork, useTasks } from "@/lib/workspace-store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LumaDesk AI — Your intelligent workplace dashboard" },
      {
        name: "description",
        content:
          "See today's priorities, upcoming deadlines and recent AI work — then start any LumaDesk AI workflow from one calm dashboard.",
      },
      { property: "og:title", content: "LumaDesk AI — Your intelligent workplace dashboard" },
      {
        property: "og:description",
        content: "A calm, premium AI productivity workspace: email, meetings, planning and research.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const deadlines = [
  { title: "Board pack submission", when: "Today · 16:00", tone: "rose" },
  { title: "Vendor decision memo", when: "Tomorrow · 12:00", tone: "gold" },
  { title: "Team onboarding plan", when: "Friday", tone: "primary" },
];

const conversations = [
  { title: "Talking points for salary review", meta: "Luma AI · 2h ago", to: "/luma" },
  { title: "Q3 stakeholder update email", meta: "Email Studio · Yesterday", to: "/email-studio" },
  { title: "Leadership sync action items", meta: "Meeting Intelligence · Yesterday", to: "/meeting-intelligence" },
];

const priorityStyles: Record<string, string> = {
  high: "bg-rose text-rose-foreground",
  medium: "bg-gold text-gold-foreground",
  low: "bg-secondary text-secondary-foreground",
};

function Dashboard() {
  const navigate = useNavigate();
  const { tasks, toggle, add } = useTasks();
  const { items: saved } = useSavedWork();
  const { recent } = useRecentTools();
  const { favorites } = useFavorites();
  const [intent, setIntent] = useState("");

  const openTasks = tasks.filter((t) => !t.done);
  const completion = tasks.length ? Math.round((tasks.filter((t) => t.done).length / tasks.length) * 100) : 0;
  const recentTools = (recent.length ? recent : ["email-studio", "luma", "work-planner"])
    .map((slug) => navBySlug(slug))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  const startWorkflow = (to: string) => {
    if (intent.trim()) add(intent.trim());
    void navigate({ to });
  };

  return (
    <>
      <PageHeader
        badge="Thursday, 20 August"
        title="Good morning, Letta"
        description="You have 4 open priorities and 3 deadlines this week. Let's make it a calm, decisive day."
      />

      <section className="relative overflow-hidden rounded-3xl border border-border shadow-lift">
        <img
          src={heroTexture}
          alt=""
          aria-hidden="true"
          width={1600}
          height={608}
          className="absolute inset-0 h-full w-full object-cover opacity-90 dark:opacity-40"
        />
        <div className="relative bg-background/55 p-6 backdrop-blur-[2px] md:p-9 dark:bg-background/70">
          <h2 className="text-display text-xl md:text-2xl">What would you like to accomplish?</h2>
          <p className="mt-1 max-w-xl text-sm text-foreground/80">
            Describe the task in your own words, then choose the workflow that fits.
          </p>
          <Textarea
            value={intent}
            onChange={(e) => setIntent(e.target.value)}
            rows={2}
            placeholder="e.g. Write a diplomatic email pushing back on the new reporting request…"
            className="mt-4 max-w-3xl resize-none rounded-2xl border-border bg-card/90 text-sm"
            aria-label="What would you like to accomplish?"
          />
          <div className="mt-4 flex flex-wrap gap-2">
            {toolItems.map((tool) => (
              <Button
                key={tool.slug}
                variant="secondary"
                size="sm"
                onClick={() => startWorkflow(tool.to)}
                className="rounded-xl bg-card/90 text-xs shadow-soft hover:bg-card"
              >
                <tool.icon className="h-3.5 w-3.5" />
                <span className="ml-1.5">{tool.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Open priorities", value: String(openTasks.length), icon: Clock, hint: "across this week" },
          { label: "Tasks completed", value: `${completion}%`, icon: CheckCircle2, hint: "of your current list" },
          { label: "AI drafts saved", value: String(saved.length), icon: Sparkles, hint: "in Saved Work" },
          { label: "Hours saved", value: "6.5", icon: TrendingUp, hint: "estimated this week" },
        ].map((stat) => (
          <div key={stat.label} className="surface-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{stat.label}</p>
              <stat.icon className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-3 text-display text-2xl">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.hint}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <section className="surface-card p-5 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold">Today&apos;s priorities</h2>
                <p className="text-xs text-muted-foreground">Tick them off as you go.</p>
              </div>
              <Badge variant="secondary" className="rounded-full">
                {openTasks.length} open
              </Badge>
            </div>
            <div className="mt-4">
              <Progress value={completion} className="h-2" />
              <p className="mt-2 text-xs text-muted-foreground">{completion}% complete</p>
            </div>
            <ul className="mt-4 divide-y divide-border">
              {tasks.map((task) => (
                <li key={task.id} className="flex items-center gap-3 py-3">
                  <Checkbox
                    checked={task.done}
                    onCheckedChange={() => toggle(task.id)}
                    aria-label={`Mark ${task.title} complete`}
                  />
                  <span className={cn("flex-1 text-sm", task.done && "text-muted-foreground line-through")}>
                    {task.title}
                  </span>
                  <span className={cn("rounded-full px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase", priorityStyles[task.priority])}>
                    {task.priority}
                  </span>
                  <span className="hidden w-20 text-right text-xs text-muted-foreground sm:block">{task.due}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="surface-card p-5 md:p-6">
            <h2 className="text-base font-semibold">Recently used AI tools</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {recentTools.map((tool) => (
                <Link
                  key={tool.slug}
                  to={tool.to}
                  className="group flex items-start gap-3 rounded-2xl border border-border bg-gradient-soft p-4 transition-colors hover:border-primary/40"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-card text-primary shadow-soft">
                    <tool.icon className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="flex items-center gap-1.5 text-sm font-semibold">
                      {tool.label}
                      {favorites.includes(tool.slug) && <span className="text-xs text-gold">★</span>}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">{tool.blurb}</span>
                  </span>
                  <ArrowRight className="ml-auto h-4 w-4 self-center text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="surface-card p-5 md:p-6">
            <h2 className="text-base font-semibold">Upcoming deadlines</h2>
            <ul className="mt-4 space-y-3">
              {deadlines.map((d) => (
                <li key={d.title} className="flex items-start gap-3 rounded-2xl bg-gradient-soft p-3.5">
                  <span
                    className={cn(
                      "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl",
                      d.tone === "rose" && "bg-rose text-rose-foreground",
                      d.tone === "gold" && "bg-gold text-gold-foreground",
                      d.tone === "primary" && "bg-primary text-primary-foreground",
                    )}
                  >
                    <CalendarClock className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-medium">{d.title}</span>
                    <span className="block text-xs text-muted-foreground">{d.when}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="surface-card p-5 md:p-6">
            <h2 className="text-base font-semibold">Recent AI conversations</h2>
            <ul className="mt-3 divide-y divide-border">
              {conversations.map((c) => (
                <li key={c.title}>
                  <Link to={c.to} className="flex items-center gap-3 py-3 text-sm hover:text-primary">
                    <Sparkles className="h-4 w-4 shrink-0 text-primary" />
                    <span>
                      <span className="block font-medium leading-snug">{c.title}</span>
                      <span className="block text-xs text-muted-foreground">{c.meta}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <Button asChild variant="outline" size="sm" className="mt-3 w-full rounded-xl">
              <Link to="/saved-work">View saved work</Link>
            </Button>
          </section>

          <ResponsibleAiNotice />
        </div>
      </div>
    </>
  );
}
