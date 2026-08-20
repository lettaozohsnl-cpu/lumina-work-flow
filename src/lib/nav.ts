import {
  LayoutDashboard,
  Mail,
  Mic,
  ListChecks,
  BookOpen,
  Sparkles,
  Bookmark,
  LayoutTemplate,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  slug: string;
  label: string;
  to: string;
  icon: LucideIcon;
  blurb: string;
};

export const navItems: NavItem[] = [
  { slug: "dashboard", label: "Dashboard", to: "/", icon: LayoutDashboard, blurb: "Your day at a glance" },
  {
    slug: "email-studio",
    label: "Email Studio",
    to: "/email-studio",
    icon: Mail,
    blurb: "Draft polished emails in any tone",
  },
  {
    slug: "meeting-intelligence",
    label: "Meeting Intelligence",
    to: "/meeting-intelligence",
    icon: Mic,
    blurb: "Turn notes into decisions & actions",
  },
  {
    slug: "work-planner",
    label: "Work Planner",
    to: "/work-planner",
    icon: ListChecks,
    blurb: "Break goals into a real workflow",
  },
  {
    slug: "research-hub",
    label: "Research Hub",
    to: "/research-hub",
    icon: BookOpen,
    blurb: "Structure research and find gaps",
  },
  { slug: "luma", label: "Luma AI", to: "/luma", icon: Sparkles, blurb: "Think out loud with your assistant" },
  { slug: "saved-work", label: "Saved Work", to: "/saved-work", icon: Bookmark, blurb: "Everything you kept" },
  { slug: "templates", label: "Templates", to: "/templates", icon: LayoutTemplate, blurb: "Reusable workplace prompts" },
  { slug: "settings", label: "Settings", to: "/settings", icon: Settings, blurb: "Preferences and AI guardrails" },
];

export const toolItems = navItems.filter((n) =>
  ["email-studio", "meeting-intelligence", "work-planner", "research-hub", "luma"].includes(n.slug),
);

export function navBySlug(slug: string) {
  return navItems.find((n) => n.slug === slug);
}
