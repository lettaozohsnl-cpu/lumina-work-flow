# LumaDesk AI

An intelligent workplace productivity platform designed to help professional women organize, automate, and streamline their daily work using AI.

LumaDesk AI combines a premium, distraction-free workspace with a suite of AI-powered tools that assist with drafting, planning, research, and meeting follow-up — all in one place.

## Features

- **Dashboard** — Daily priorities, upcoming deadlines, quick-action intent input, and productivity stats.
- **Luma AI Assistant** — Full conversational AI for open-ended workplace questions and tasks.
- **AI Email Studio** — Draft professional emails with adjustable tone, length, and intent.
- **Meeting Intelligence** — Transform meeting notes or transcripts into structured summaries and action items.
- **Work Planner** — Generate project roadmaps, prioritize tasks, and break work into phases.
- **Research Hub** — Structure knowledge, sources, and talking points into polished research briefs.
- **Saved Work** — Searchable repository of generated outputs and reusable ideas.
- **Templates** — Library of reusable workplace prompt templates.
- **Settings** — Preferences, AI defaults, and notification toggles.

## Built With

- [TanStack Start](https://tanstack.com/start/) — Full-stack React framework with SSR/SSG and server functions
- [React 19](https://react.dev/) — UI library
- [TypeScript](https://www.typescriptlang.org/) — Type-safe development
- [Tailwind CSS v4](https://tailwindcss.com/) — Utility-first styling with native CSS `@theme` variables
- [Lovable AI Gateway](https://docs.lovable.dev/features/ai) — AI completions via `google/gemini-3.7-flash`
- [Lovable Cloud](https://docs.lovable.dev/features/cloud) — Integrated backend, auth, and storage
- [shadcn/ui](https://ui.shadcn.com/) — Accessible, composable UI components

## Design System

LumaDesk AI uses a warm, elevated palette tailored to a professional audience:

- **Warm neutrals** — soft cream, latte, and deep espresso tones
- **Muted lavender & mauve** — primary accents
- **Dusty rose & soft gold** — highlights and status colors
- **Typography** — `Fraunces` for display headings, `DM Sans` for body text
- **Dark mode** — fully supported via CSS variables and a persistent theme toggle

## Development

```bash
# Install dependencies
bun install

# Start the development server
bun run dev
```

The dev server runs on `http://localhost:8080` by default.

## Project Structure

```
src/
  components/          # Shared UI components (AppShell, ToolWorkspace, etc.)
  hooks/               # Custom React hooks
  lib/                 # Utilities, state management, and server functions
  routes/              # TanStack Start file-based routes
  styles.css           # Global design tokens and Tailwind v4 imports
  router.tsx           # Router configuration
  start.ts             # App start configuration
public/                # Static assets
```

## AI Integration

AI features are powered by a server function wrapper around the Lovable AI Gateway:

- `src/lib/ai.server.ts` — Gateway client and error handling
- `src/lib/ai.functions.ts` — TanStack Start server functions used by the UI
- Model: `google/gemini-3.7-flash`

## Environment

LumaDesk AI runs on Lovable Cloud. Required environment variables are managed automatically by the platform, including the Lovable API key used for AI gateway requests.

## License

This project is built and maintained by the project owner. All rights reserved.
