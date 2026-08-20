import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import {
  Bell,
  ChevronsLeft,
  ChevronsRight,
  Menu,
  Moon,
  Search,
  Sun,
  Sparkles,
  X,
} from "lucide-react";

import { navItems } from "@/lib/nav";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

const notifications = [
  { title: "Q3 stakeholder email is still a draft", meta: "Email Studio · 2h ago" },
  { title: "3 action items from Leadership Sync are unassigned", meta: "Meeting Intelligence · 5h ago" },
  { title: "Weekly productivity summary is ready", meta: "Dashboard · Yesterday" },
];

function Brand({ collapsed }: { collapsed?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5 px-1 py-1">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-luma text-primary-foreground shadow-glow">
        <Sparkles className="h-4.5 w-4.5" />
      </span>
      {!collapsed && (
        <span className="leading-tight">
          <span className="block text-display text-[1.05rem]">LumaDesk</span>
          <span className="block text-[0.65rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            AI Workspace
          </span>
        </span>
      )}
    </Link>
  );
}

function NavLinks({ collapsed, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
        return (
          <Link
            key={item.slug}
            to={item.to}
            onClick={onNavigate}
            title={collapsed ? item.label : undefined}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-soft"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              collapsed && "justify-center px-2",
            )}
          >
            <item.icon className={cn("h-4.5 w-4.5 shrink-0", active && "text-primary")} />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggle } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-sidebar-border bg-sidebar px-3 py-4 transition-[width] duration-300 lg:flex",
          collapsed ? "w-[76px]" : "w-[264px]",
        )}
      >
        <Brand collapsed={collapsed} />
        <div className="mt-6 flex-1 overflow-y-auto">
          <NavLinks collapsed={collapsed} />
        </div>
        <div className="mt-4 space-y-3">
          {!collapsed && (
            <div className="rounded-2xl bg-gradient-soft p-3.5 text-xs text-muted-foreground">
              <p className="font-semibold text-foreground">Luma tip</p>
              <p className="mt-1">Give Luma the recipient, purpose and tone — specific inputs, sharper drafts.</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed((c) => !c)}
            className="w-full justify-center text-muted-foreground"
          >
            {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
            {!collapsed && <span className="ml-1">Collapse</span>}
          </Button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close menu"
            className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex h-full w-[280px] max-w-[85%] flex-col border-r border-sidebar-border bg-sidebar px-3 py-4">
            <div className="flex items-center justify-between">
              <Brand />
              <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-6 flex-1 overflow-y-auto">
              <NavLinks onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>
        </div>
      )}

      <div className={cn("transition-[padding] duration-300", collapsed ? "lg:pl-[76px]" : "lg:pl-[264px]")}>
        <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
          <div className="flex h-16 items-center gap-3 px-4 md:px-6">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="lg:hidden">
              <Brand collapsed />
            </div>
            <div className="relative ml-auto hidden w-full max-w-sm md:block lg:ml-0">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search work, drafts, templates…"
                className="h-10 rounded-xl border-border bg-card pl-9"
                aria-label="Search LumaDesk"
              />
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                    <Bell className="h-4.5 w-4.5" />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-80 rounded-2xl p-2">
                  <p className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Notifications
                  </p>
                  {notifications.map((n) => (
                    <div key={n.title} className="rounded-xl px-2 py-2 hover:bg-secondary">
                      <p className="text-sm font-medium leading-snug">{n.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{n.meta}</p>
                    </div>
                  ))}
                </PopoverContent>
              </Popover>
              <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle dark mode">
                {theme === "dark" ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
              </Button>
              <div className="ml-1 flex items-center gap-2 rounded-xl border border-border bg-card px-2 py-1.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-luma text-xs font-semibold text-primary-foreground">
                  LO
                </span>
                <span className="hidden text-xs leading-tight sm:block">
                  <span className="block font-semibold">Letta Ozoh</span>
                  <span className="block text-muted-foreground">Operations Lead</span>
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 pb-24 pt-6 md:px-6 lg:pb-10">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-background/95 px-2 py-1.5 backdrop-blur-md lg:hidden">
        <ul className="flex items-center justify-between">
          {navItems.slice(0, 5).map((item) => (
            <li key={item.slug} className="flex-1">
              <Link
                to={item.to}
                className="flex flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-[0.62rem] font-medium text-muted-foreground [&.active]:text-primary"
                activeOptions={{ exact: item.to === "/" }}
              >
                <item.icon className="h-4.5 w-4.5" />
                <span className="truncate">{item.label.split(" ")[0]}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  badge,
  children,
}: {
  title: string;
  description: string;
  badge?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="space-y-2">
        {badge && (
          <Badge variant="secondary" className="rounded-full bg-accent text-accent-foreground">
            {badge}
          </Badge>
        )}
        <h1 className="text-display text-2xl md:text-3xl">{title}</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
}
