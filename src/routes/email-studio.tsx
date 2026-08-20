import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/AppShell";
import { ToolWorkspace, type ToolConfig } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/email-studio")({
  head: () => ({
    meta: [
      { title: "AI Email Studio — LumaDesk AI" },
      {
        name: "description",
        content:
          "Draft professional workplace emails with a structured brief: recipient, purpose, key points, tone, length and call to action.",
      },
      { property: "og:title", content: "AI Email Studio — LumaDesk AI" },
      { property: "og:description", content: "Structured AI email drafting for professionals." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EmailStudio,
});

const config: ToolConfig = {
  slug: "email-studio",
  title: "Email Studio",
  system:
    "You are Luma, an expert workplace communication partner for busy professionals. You write clear, credible, human emails — never flowery, never robotic. Always return a subject line, then the email body, then a short note on anything the sender should verify. Use markdown-free plain text suitable for pasting into an email client.",
  submitLabel: "Draft my email",
  resultLabel: "Email draft",
  emptyState: "Tell Luma who you're writing to and what needs to happen — your draft will appear here, ready to edit.",
  fields: [
    { name: "recipient", label: "Recipient", type: "text", placeholder: "e.g. Head of Finance, external client", required: true, span: "half" },
    { name: "purpose", label: "Purpose", type: "text", placeholder: "e.g. request budget approval", required: true, span: "half" },
    {
      name: "info",
      label: "Important information",
      type: "textarea",
      rows: 5,
      placeholder: "Key points, context, numbers, dates, constraints…",
      required: true,
    },
    {
      name: "tone",
      label: "Tone",
      type: "select",
      options: ["Professional", "Friendly", "Confident", "Concise", "Diplomatic"],
      span: "half",
    },
    { name: "length", label: "Length", type: "select", options: ["Short", "Medium", "Detailed"], span: "half" },
    { name: "cta", label: "Call to action", type: "text", placeholder: "e.g. confirm approval by Friday", span: "full" },
  ],
  buildPrompt: (v) =>
    `Write a workplace email.\nRecipient: ${v.recipient}\nPurpose: ${v.purpose}\nKey information: ${v.info}\nTone: ${v.tone}\nLength: ${v.length}\nDesired call to action: ${v.cta || "not specified"}`,
};

function EmailStudio() {
  return (
    <>
      <PageHeader
        badge="AI Email Studio"
        title="Write the email once, properly"
        description="Give Luma the brief and get a credible draft in the tone you need — then edit, refine and send with confidence."
      />
      <ToolWorkspace config={config} />
    </>
  );
}
