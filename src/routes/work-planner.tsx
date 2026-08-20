import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/AppShell";
import { ToolWorkspace, type ToolConfig } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/work-planner")({
  head: () => ({
    meta: [
      { title: "Smart Work Planner — LumaDesk AI" },
      {
        name: "description",
        content:
          "Turn a project, goal or deadline into prioritised tasks with effort estimates and a practical week-by-week workflow.",
      },
      { property: "og:title", content: "Smart Work Planner — LumaDesk AI" },
      { property: "og:description", content: "AI planning that turns goals into an achievable workflow." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WorkPlanner,
});

const config: ToolConfig = {
  slug: "work-planner",
  title: "Work Planner",
  system:
    "You are Luma, a pragmatic project planner. Break goals into concrete tasks with: priority (High/Medium/Low), effort estimate in hours or days, suggested sequence, dependencies and milestones. Organise output into phases with a realistic schedule against the stated deadline, then list risks and the first three things to do today. Be specific and avoid generic advice.",
  submitLabel: "Build my plan",
  resultLabel: "Work plan",
  emptyState: "Describe the project or goal and your deadline — Luma will structure it into prioritised, estimated tasks.",
  fields: [
    { name: "goal", label: "Project or goal", type: "text", placeholder: "e.g. launch internal onboarding programme", required: true },
    {
      name: "context",
      label: "Context & constraints",
      type: "textarea",
      rows: 5,
      placeholder: "Scope, stakeholders, resources, what already exists…",
      required: true,
    },
    { name: "deadline", label: "Deadline", type: "text", placeholder: "e.g. 30 September", span: "half" },
    { name: "capacity", label: "Weekly capacity", type: "select", options: ["A few hours", "1 day", "2–3 days", "Full time"], span: "half" },
    { name: "team", label: "Who's involved", type: "text", placeholder: "e.g. me + 2 analysts", span: "half" },
    { name: "style", label: "Plan style", type: "select", options: ["Phased roadmap", "Weekly sprint plan", "Simple task checklist", "Kanban-ready backlog"], span: "half" },
  ],
  buildPrompt: (v) =>
    `Create a work plan.\nGoal: ${v["goal"]}\nContext and constraints: ${v["context"]}\nDeadline: ${v["deadline"] || "not specified"}\nWeekly capacity: ${v["capacity"]}\nPeople involved: ${v["team"] || "just me"}\nPreferred format: ${v["style"]}`,
  refinements: [
    { label: "Simplify", instruction: "Reduce this to the essential critical path — fewer, bigger steps." },
    { label: "Add detail", instruction: "Add sub-tasks, owners and acceptance criteria to each task." },
    { label: "Tighter timeline", instruction: "Recompress this plan into a faster, more aggressive timeline and flag what gets cut." },
    { label: "Highlight risks", instruction: "Add a risk register with likelihood, impact and mitigation for this plan." },
  ],
};

function WorkPlanner() {
  return (
    <>
      <PageHeader
        badge="Smart Work Planner"
        title="From ambitious goal to doable week"
        description="Luma breaks your project into prioritised tasks with effort estimates and a sequence you can actually work through."
      />
      <ToolWorkspace config={config} />
    </>
  );
}
