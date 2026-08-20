import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/AppShell";
import { ToolWorkspace, type ToolConfig } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/research-hub")({
  head: () => ({
    meta: [
      { title: "AI Knowledge & Research Hub — LumaDesk AI" },
      {
        name: "description",
        content:
          "Structure research topics, generate research questions, compare findings, spot knowledge gaps and produce concise briefs.",
      },
      { property: "og:title", content: "AI Knowledge & Research Hub — LumaDesk AI" },
      { property: "og:description", content: "Organise research and produce sharp briefs with AI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResearchHub,
});

const config: ToolConfig = {
  slug: "research-hub",
  title: "Research Hub",
  system:
    "You are Luma, a research strategist. Structure the topic into: scope and framing, sharp research questions, a comparison of the known positions or options, evidence the user still needs, explicit knowledge gaps, and a concise brief with recommendations. Distinguish clearly between what is well established and what needs verification, and never fabricate citations, statistics or sources — instead name the type of source the user should consult.",
  submitLabel: "Structure my research",
  resultLabel: "Research brief",
  emptyState: "Give Luma a topic and the decision it supports — you'll get questions, structure, comparisons and gaps.",
  fields: [
    { name: "topic", label: "Research topic", type: "text", placeholder: "e.g. hybrid work policy benchmarks", required: true },
    {
      name: "objective",
      label: "Decision this supports",
      type: "textarea",
      rows: 4,
      placeholder: "What will you decide or recommend once this research is done?",
      required: true,
    },
    { name: "findings", label: "What you already know", type: "textarea", rows: 5, placeholder: "Existing notes, sources or findings (optional)" },
    { name: "depth", label: "Depth", type: "select", options: ["Quick orientation", "Working brief", "Deep dive"], span: "half" },
    { name: "output", label: "Output shape", type: "select", options: ["Research brief", "Question map", "Comparison table", "Executive one-pager"], span: "half" },
  ],
  buildPrompt: (v) =>
    `Structure this research.\nTopic: ${v.topic}\nDecision it supports: ${v.objective}\nExisting findings: ${v.findings || "none provided"}\nDepth: ${v.depth}\nPreferred output: ${v.output}`,
  refinements: [
    { label: "Sharper questions", instruction: "Rewrite with more precise, higher-leverage research questions." },
    { label: "Comparison table", instruction: "Reformat the core content as a clear comparison table." },
    { label: "One-pager", instruction: "Condense this into a one-page executive brief with a recommendation." },
    { label: "Find the gaps", instruction: "Focus on knowledge gaps and exactly what evidence is still missing." },
  ],
};

function ResearchHub() {
  return (
    <>
      <PageHeader
        badge="Knowledge & Research Hub"
        title="Research with structure, not tabs"
        description="Frame the question, organise what you know, see what's missing, and leave with a brief you can present."
      />
      <ToolWorkspace config={config} />
    </>
  );
}
