import { useCallback, useEffect, useState } from "react";

export type SavedItem = {
  id: string;
  tool: string;
  title: string;
  content: string;
  createdAt: string;
};

export type TaskItem = {
  id: string;
  title: string;
  priority: "high" | "medium" | "low";
  due: string;
  done: boolean;
};

const SAVED_KEY = "lumadesk-saved";
const TASKS_KEY = "lumadesk-tasks";
const RECENT_KEY = "lumadesk-recent-tools";
const FAV_KEY = "lumadesk-favorites";

const seedTasks: TaskItem[] = [
  { id: "t1", title: "Send Q3 stakeholder update email", priority: "high", due: "Today", done: false },
  { id: "t2", title: "Summarise leadership sync notes", priority: "high", due: "Today", done: false },
  { id: "t3", title: "Draft onboarding plan for new analyst", priority: "medium", due: "Tomorrow", done: false },
  { id: "t4", title: "Review vendor research brief", priority: "medium", due: "Fri", done: true },
  { id: "t5", title: "Prepare budget talking points", priority: "low", due: "Next week", done: false },
];

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function useLocalState<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setValue(read<T>(key, fallback));
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          /* storage unavailable */
        }
        return resolved;
      });
    },
    [key],
  );

  return { value, update, hydrated };
}

export function useSavedWork() {
  const { value, update, hydrated } = useLocalState<SavedItem[]>(SAVED_KEY, []);

  const save = useCallback(
    (item: Omit<SavedItem, "id" | "createdAt">) => {
      update((prev) => [
        { ...item, id: crypto.randomUUID(), createdAt: new Date().toISOString() },
        ...prev,
      ]);
    },
    [update],
  );

  const remove = useCallback((id: string) => update((prev) => prev.filter((i) => i.id !== id)), [update]);

  return { items: value, save, remove, hydrated };
}

export function useTasks() {
  const { value, update, hydrated } = useLocalState<TaskItem[]>(TASKS_KEY, seedTasks);
  const toggle = useCallback(
    (id: string) => update((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))),
    [update],
  );
  const add = useCallback(
    (title: string) =>
      update((prev) => [
        { id: crypto.randomUUID(), title, priority: "medium" as const, due: "Today", done: false },
        ...prev,
      ]),
    [update],
  );
  return { tasks: value, toggle, add, hydrated };
}

export function useRecentTools() {
  const { value, update } = useLocalState<string[]>(RECENT_KEY, []);
  const track = useCallback(
    (slug: string) => update((prev) => [slug, ...prev.filter((s) => s !== slug)].slice(0, 5)),
    [update],
  );
  return { recent: value, track };
}

export function useFavorites() {
  const { value, update } = useLocalState<string[]>(FAV_KEY, ["email-studio", "luma"]);
  const toggle = useCallback(
    (slug: string) => update((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug])),
    [update],
  );
  return { favorites: value, toggle };
}
