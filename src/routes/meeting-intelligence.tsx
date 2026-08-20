import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/AppShell";
import { ToolWorkspace, type ToolConfig } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/meeting-intelligence")({
  head: () => ({
    meta: [
      { title: "Meeting Intelligence — LumaDesk AI" },
      {
        name: "description",
        content:
          "Paste meeting notes or transcripts and get a summary, decisions, action items, owners and deadlines in seconds.",
      },
      { property: "og:title", content: "Meeting Intelligence — LumaDesk AI" },
      { property: "og:description", content: "Turn messy meeting notes into decisions and action items." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MeetingIntelligence,
});

const config: ToolConfig = {
  slug: "meeting-intelligence",
  title: "Meeting Intelligence",
  system:
    "You are Luma, a meticulous meeting analyst. From notes or transcripts you produce: 1) a concise summary, 2) key decisions, 3) action items with owner and deadline in a clear list, 4) open questions and risks, 5) anything ambiguous that the user must confirm. Never invent owners or dates — mark them as 'unassigned' or 'no date given'. Use short headings and bullet lists.",
  submitLabel: "Analyse meeting",
  resultLabel: "Meeting brief",
  emptyState: "Paste your transcript or rough notes — Luma will return a summary, decisions, owners and deadlines.",
  fields: [
    { name: "title", label: "Meeting", type: "text", placeholder: "e.g. Q3 leadership sync", span: "half" },
    { name: "date", label: "Date", type: "text", placeholder: "e.g. 18 August", span: "half" },
    { name: "attendees", label: "Attendees", type: "text", placeholder: "Names and roles (optional)" },
    {
      name: "transcript",
      label: "Transcript or notes",
      type: "textarea",
      rows: 10,
      placeholder: "Paste the raw transcript or your notes here…",
      required: true,
    },
    {
      name: "focus",
      label: "Focus",
      type: "select",
      options: ["Balanced brief", "Decisions & actions only", "Executive summary", "Follow-up email ready"],
      span: "half",
    },
    { name: "audience", label: "Share with", type: "select", options: ["My own records", "My team", "Leadership", "Client"], span: "half" },
  ],
  buildPrompt: (v) =>
    `Analyse this meeting.\nMeeting: ${v["title"] || "untitled"}\nDate: ${v["date"] || "not given"}\nAttendees: ${v["attendees"] || "not given"}\nOutput focus: ${v["focus"]}\nIntended audience: ${v["audience"]}\n\nNotes/transcript:\n${v["transcript"]}`,
  refinements: [
    { label: "Shorter", instruction: "Condense this into a tighter brief without losing decisions or action items." },
    { label: "Actions only", instruction: "Return only the action items with owners and deadlines, as a clean checklist." },
    { label: "Follow-up email", instruction: "Rewrite this as a polished follow-up email to attendees." },
    { label: "Flag risks", instruction: "Add a clear section listing risks, blockers and unresolved questions." },
  ],
};

function MeetingIntelligence() {
  return (
    <>
      <PageHeader
        badge="Meeting Intelligence"
        title="Leave every meeting with clarity"
        description="Summaries, decisions, owners and deadlines extracted from your notes — so nothing important lives only in your memory."
      />
      <ToolWorkspace config={config} />
    </>
  );
}
