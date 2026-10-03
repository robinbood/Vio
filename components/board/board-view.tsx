import { CalendarClock, MessageSquare, Paperclip, CheckSquare } from "lucide-react";
import type { BoardListRow } from "@/lib/data/boards";

/** The shape of the `card.badges` JSON blob, as far as the UI reads it. */
type CardBadges = {
  comments?: number;
  attachments?: number;
  checklist?: { total?: number; completed?: number };
};

function badges(raw: Record<string, unknown> | null): CardBadges {
  if (!raw || typeof raw !== "object") return {};
  const b = raw as CardBadges;
  return {
    comments: typeof b.comments === "number" ? b.comments : undefined,
    attachments: typeof b.attachments === "number" ? b.attachments : undefined,
    checklist:
      b.checklist && typeof b.checklist === "object" ? b.checklist : undefined,
  };
}

function isOverdue(due: Date | null, complete: boolean): boolean {
  return Boolean(due) && !complete && new Date(due as Date).getTime() < Date.now();
}

/** Compact due-date chip text, matching Trello's wording. */
function dueLabel(due: Date): string {
  const date = new Date(due);
  const today = new Date();
  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  ).getTime();
  const days = Math.round((date.getTime() - startOfToday) / 86_400_000);

  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days === -1) return "Yesterday";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function BoardView({ lists }: { lists: BoardListRow[] }) {
  if (lists.length === 0) {
    return (
      <p className="p-6 text-sm text-white/80">This board has no lists yet.</p>
    );
  }

  return (
    <div className="flex flex-1 gap-3 overflow-x-auto p-4">
      {lists.map((list) => (
        <section
          key={list.id}
          aria-label={list.name}
          className="flex w-72 shrink-0 flex-col rounded-xl bg-black/20"
        >
          <h2 className="flex items-center justify-between px-3 py-2 text-sm font-semibold text-white">
            {list.name}
            <span className="text-xs font-normal text-white/70">
              {list.cards.length}
            </span>
          </h2>

          <ul className="flex flex-col gap-2 px-2 pb-2">
            {list.cards.map((item) => {
              const b = badges(item.badges);
              const overdue = isOverdue(item.due, item.dueComplete);
              return (
                <li key={item.id}>
                  <article className="rounded-lg bg-white p-2 shadow-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-semibold text-muted-foreground">
                        {item.idShort}
                      </span>
                      <p className="flex-1 text-sm">{item.name}</p>
                    </div>

                    {item.due && (
                      <span
                        className={
                          overdue
                            ? "mt-2 inline-flex items-center gap-1 rounded bg-red-100 px-1.5 py-0.5 text-xs font-medium text-red-700"
                            : "mt-2 inline-flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
                        }
                      >
                        <CalendarClock className="h-3 w-3" />
                        {item.dueComplete ? (
                          <span className="line-through">{dueLabel(item.due)}</span>
                        ) : (
                          dueLabel(item.due)
                        )}
                      </span>
                    )}

                    {(b.comments || b.attachments || b.checklist) && (
                      <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                        {Boolean(b.comments) && (
                          <span className="inline-flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {b.comments}
                          </span>
                        )}
                        {Boolean(b.attachments) && (
                          <span className="inline-flex items-center gap-1">
                            <Paperclip className="h-3 w-3" />
                            {b.attachments}
                          </span>
                        )}
                        {b.checklist?.total ? (
                          <span className="inline-flex items-center gap-1">
                            <CheckSquare className="h-3 w-3" />
                            {b.checklist.completed ?? 0}/{b.checklist.total}
                          </span>
                        ) : null}
                      </div>
                    )}
                  </article>
                </li>
              );
            })}
          </ul>

          <div className="mt-auto px-2 pb-2">
            <p className="rounded-lg bg-white/20 px-2 py-1.5 text-sm text-white">
              + Add a card
            </p>
          </div>
        </section>
      ))}
    </div>
  );
}
