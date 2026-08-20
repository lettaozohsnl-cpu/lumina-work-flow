import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { Bookmark, Copy, Search, Trash2 } from "lucide-react";

import { PageHeader } from "@/components/AppShell";
import { useSavedWork } from "@/lib/workspace-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/saved-work")({
  head: () => ({
    meta: [
      { title: "Saved Work — LumaDesk AI" },
      { name: "description", content: "Every draft, brief and plan you have kept in LumaDesk AI, searchable in one place." },
      { property: "og:title", content: "Saved Work — LumaDesk AI" },
      { property: "og:description", content: "Your saved AI drafts, briefs and plans." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SavedWork,
});

function SavedWork() {
  const { items, remove, hydrated } = useSavedWork();
  const [query, setQuery] = useState("");

  const filtered = items.filter(
    (i) =>
      i.title.toLowerCase().includes(query.toLowerCase()) ||
      i.tool.toLowerCase().includes(query.toLowerCase()) ||
      i.content.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <>
      <PageHeader
        badge="Saved Work"
        title="Everything you decided to keep"
        description="Drafts, meeting briefs, plans and research you saved from your AI tools."
      >
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search saved work"
            className="h-10 rounded-xl bg-card pl-9"
          />
        </div>
      </PageHeader>

      {hydrated && filtered.length === 0 ? (
        <div className="surface-card flex flex-col items-center justify-center p-14 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
            <Bookmark className="h-5 w-5" />
          </span>
          <h2 className="mt-4 text-display text-lg">Nothing saved yet</h2>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Generate something in Email Studio, Meeting Intelligence, Work Planner or Research Hub and press Save.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filtered.map((item) => (
            <article key={item.id} className="surface-card flex flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Badge variant="secondary" className="rounded-full bg-accent text-accent-foreground">
                    {item.tool}
                  </Badge>
                  <h2 className="mt-2 text-base font-semibold">{item.title}</h2>
                  <p className="text-xs text-muted-foreground">
                    Saved {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Copy"
                    onClick={() => {
                      void navigator.clipboard.writeText(item.content);
                      toast.success("Copied to clipboard");
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Delete"
                    onClick={() => {
                      remove(item.id);
                      toast.success("Removed");
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="prose-luma mt-4 max-h-64 overflow-y-auto rounded-xl bg-gradient-soft p-4 text-sm text-muted-foreground">
                <ReactMarkdown>{item.content}</ReactMarkdown>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
