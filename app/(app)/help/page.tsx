import type { Metadata } from "next";

export const metadata: Metadata = { title: "Keyboard shortcuts" };

/** AGENTS.md §15 — Trello's keyboard map. */
const SHORTCUTS: { keys: string[]; description: string }[] = [
  { keys: ["?"], description: "Open this cheat sheet" },
  { keys: ["/"], description: "Focus search / quick card finder on a board" },
  { keys: ["b"], description: "Open the boards menu" },
  { keys: ["c"], description: "Archive a card (when a card is focused)" },
  { keys: ["e"], description: "Edit card name" },
  { keys: ["f"], description: "Open filter" },
  { keys: ["n"], description: "New card (when a list is focused)" },
  { keys: ["#"], description: "New list" },
  { keys: ["m"], description: "Add member (in card back)" },
  { keys: ["l"], description: "Add label (in card back)" },
  { keys: ["d"], description: "Set due date (in card back)" },
  { keys: ["a"], description: "Add attachment" },
  { keys: ["w"], description: "Toggle watch" },
  { keys: ["Space", "Enter"], description: "Open the focused card" },
  { keys: ["→", "←"], description: "Next / previous card (card modal open)" },
  { keys: ["["], description: "Archive (list view, focused card)" },
  { keys: ["]"], description: "Send to bottom (list view, focused card)" },
  { keys: ["Esc"], description: "Close modal / clear focus" },
  { keys: ["Ctrl", "Z"], description: "Undo last action (board scope)" },
  { keys: ["Ctrl", "Enter"], description: "Submit inline edits / save description" },
  { keys: ["1", "…", "9"], description: "Quick switch between pinned boards" },
];

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-2xl p-6 sm:p-8">
      <h1 className="text-2xl font-semibold tracking-tight">
        Keyboard shortcuts
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Press <kbd className="rounded border px-1.5 py-0.5 text-xs">?</kbd> from
        anywhere in the app to come back here.
      </p>

      <dl className="mt-6 divide-y rounded-xl border">
        {SHORTCUTS.map(({ keys, description }) => (
          <div
            key={description}
            className="flex items-center justify-between gap-4 p-3"
          >
            <dt className="text-sm text-muted-foreground">{description}</dt>
            <dd className="flex shrink-0 gap-1">
              {keys.map((k) => (
                <kbd
                  key={k}
                  className="rounded border bg-muted px-1.5 py-0.5 font-mono text-xs"
                >
                  {k}
                </kbd>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
