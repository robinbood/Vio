import { Layout } from "lucide-react";

const COLUMNS = [
  {
    name: "Backlog",
    cards: [
      { title: "Pricing page", accent: "from-pink-500/70 via-violet-500/70 to-indigo-500/70", badge: null },
      { title: "Onboarding emails", accent: "from-amber-400/70 to-rose-400/70", badge: null },
      { title: "Auth refactor", accent: "from-emerald-400/70 to-cyan-400/70", badge: null },
    ],
  },
  {
    name: "In progress",
    cards: [
      { title: "Vio logo system", accent: "from-violet-500/70 to-indigo-500/70", badge: "Due tomorrow" },
      { title: "Drag & drop v2", accent: "from-cyan-400/70 to-blue-500/70", badge: null },
    ],
  },
  {
    name: "Shipped",
    cards: [
      { title: "v1.0 launch", accent: "from-emerald-400/70 to-teal-500/70", badge: "Done" },
      { title: "Marketing site", accent: "from-slate-400/70 to-slate-500/70", badge: null },
      { title: "Press kit", accent: "from-fuchsia-400/70 to-violet-500/70", badge: null },
    ],
  },
] as const;

export async function KanbanPreview() {
  // Simulated server work so the streaming boundary is real (and the
  // page is not 100% static). When we wire real board data this is the
  // hook-point for `db.query…` and `unstable_cache`.
  await new Promise((r) => setTimeout(r, 50));

  return (
    <div className="relative overflow-hidden rounded-2xl border bg-card/80 shadow-2xl shadow-violet-500/10 backdrop-blur">
      <div className="flex h-9 items-center gap-1.5 border-b bg-muted/40 px-4">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
        <div className="ml-3 flex-1 text-center text-xs text-muted-foreground">
          Product launch · Q3
        </div>
      </div>
      <div className="grid gap-3 p-4 sm:grid-cols-3 sm:gap-4 sm:p-6">
        {COLUMNS.map((col) => (
          <div
            key={col.name}
            className="flex flex-col rounded-xl bg-muted/30 p-3 ring-1 ring-border/60"
          >
            <div className="mb-3 flex items-center justify-between px-1">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {col.name}
              </h3>
              <span className="text-xs text-muted-foreground">
                {col.cards.length}
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-2">
              {col.cards.map((c) => (
                <div
                  key={c.title}
                  className="rounded-lg border bg-card p-3 text-left text-sm shadow-sm"
                >
                  <div
                    className={`mb-1.5 h-1.5 w-12 rounded-full bg-gradient-to-r ${c.accent}`}
                  />
                  <div className="text-foreground/90">{c.title}</div>
                  {c.badge && (
                    <div
                      className={
                        c.badge === "Done"
                          ? "mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                          : "mt-2 inline-flex items-center gap-1 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                      }
                    >
                      {c.badge}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Layout className="h-3.5 w-3.5" /> 8 cards · 3 lists
        </div>
        <span>Live preview</span>
      </div>
    </div>
  );
}
