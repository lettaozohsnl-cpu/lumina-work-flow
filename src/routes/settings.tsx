import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Moon, Sun } from "lucide-react";

import { PageHeader } from "@/components/AppShell";
import { ResponsibleAiNotice } from "@/components/ResponsibleAiNotice";
import { useTheme } from "@/lib/theme";
import { useFavorites } from "@/lib/workspace-store";
import { toolItems } from "@/lib/nav";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — LumaDesk AI" },
      { name: "description", content: "Manage your LumaDesk AI profile, default tone, appearance, notifications and AI guardrails." },
      { property: "og:title", content: "Settings — LumaDesk AI" },
      { property: "og:description", content: "Preferences and responsible AI guardrails." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Settings;
});

function Settings() {
  const { theme, toggle } = useTheme();
  const { favorites, toggle: toggleFavorite } = useFavorites();
  const [notify, setNotify] = useState({ deadlines: true, digest: true, mentions: false });

  return (
    <>
      <PageHeader
        badge="Settings"
        title="Make LumaDesk yours"
        description="Profile, defaults, appearance and the guardrails that keep AI use safe at work."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="surface-card p-5 md:p-6">
          <h2 className="text-base font-semibold">Profile</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Name</Label>
              <Input defaultValue="Letta Ozoh" className="mt-1.5 h-10 rounded-xl bg-background" />
            </div>
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Role</Label>
              <Input defaultValue="Operations Lead" className="mt-1.5 h-10 rounded-xl bg-background" />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Organisation</Label>
              <Input defaultValue="Northlight Group" className="mt-1.5 h-10 rounded-xl bg-background" />
            </div>
          </div>
        </section>

        <section className="surface-card p-5 md:p-6">
          <h2 className="text-base font-semibold">AI defaults</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Default tone</Label>
              <Select defaultValue="Professional">
                <SelectTrigger className="mt-1.5 h-10 rounded-xl bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Professional", "Friendly", "Confident", "Concise", "Diplomatic"].map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Default length</Label>
              <Select defaultValue="Medium">
                <SelectTrigger className="mt-1.5 h-10 rounded-xl bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Short", "Medium", "Detailed"].map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Favourite tools</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {toolItems.map((tool) => (
                <button
                  key={tool.slug}
                  onClick={() => toggleFavorite(tool.slug)}
                  className={cn(
                    "rounded-full border border-border px-3.5 py-1.5 text-xs font-medium transition-colors",
                    favorites.includes(tool.slug) ? "bg-accent text-accent-foreground" : "bg-card text-muted-foreground",
                  )}
                >
                  {tool.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="surface-card p-5 md:p-6">
          <h2 className="text-base font-semibold">Appearance</h2>
          <div className="mt-4 flex items-center justify-between rounded-2xl bg-gradient-soft p-4">
            <div>
              <p className="text-sm font-medium">{theme === "dark" ? "Dark mode" : "Light mode"}</p>
              <p className="text-xs text-muted-foreground">Warm neutrals by day, low-glare charcoal at night.</p>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl" onClick={toggle}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span className="ml-1.5">Switch</span>
            </Button>
          </div>
        </section>

        <section className="surface-card p-5 md:p-6">
          <h2 className="text-base font-semibold">Notifications</h2>
          <div className="mt-4 space-y-4">
            {[
              { key: "deadlines" as const, label: "Deadline reminders", hint: "Nudge me the day before something is due" },
              { key: "digest" as const, label: "Weekly productivity digest", hint: "A Monday summary of last week" },
              { key: "mentions" as const, label: "Action item mentions", hint: "When a meeting assigns something to me" },
            ].map((row) => (
              <div key={row.key} className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">{row.label}</p>
                  <p className="text-xs text-muted-foreground">{row.hint}</p>
                </div>
                <Switch
                  checked={notify[row.key]}
                  onCheckedChange={(v) => setNotify((prev) => ({ ...prev, [row.key]: v }))}
                  aria-label={row.label}
                />
              </div>
            ))}
          </div>
        </section>

        <div className="lg:col-span-2">
          <ResponsibleAiNotice />
        </div>
      </div>
    </>
  );
}
