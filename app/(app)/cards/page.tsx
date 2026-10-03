import Link from "next/link";
import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { redirect } from "next/navigation";
import { CalendarClock, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { board, card, cardMember, list as listTable } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth/current-user";
import { listUserBoards } from "@/lib/data/boards";

export const metadata = {
  title: "Cards",
};

function dueDateLabel(due: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: due.getFullYear() === new Date().getFullYear() ? undefined : "numeric",
  }).format(due);
}

function isOverdue(due: Date | null, complete: boolean): boolean {
  return due !== null && !complete && due.getTime() < Date.now();
}

export default async function CardsPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login");

  const visibleBoardIds = (await listUserBoards(currentUser.id)).map(
    (visibleBoard) => visibleBoard.id
  );
  const assignedCards = visibleBoardIds.length
    ? await db
        .select({
          id: card.id,
          name: card.name,
          due: card.due,
          dueComplete: card.dueComplete,
          boardId: board.id,
          boardName: board.name,
          listName: listTable.name,
        })
        .from(card)
        .innerJoin(cardMember, eq(cardMember.cardId, card.id))
        .innerJoin(board, eq(board.id, card.boardId))
        .innerJoin(listTable, eq(listTable.id, card.listId))
        .where(
          and(
            eq(cardMember.userId, currentUser.id),
            eq(card.isClosed, false),
            eq(card.isTemplate, false),
            eq(board.isClosed, false),
            eq(listTable.isClosed, false),
            inArray(card.boardId, visibleBoardIds)
          )
        )
        .orderBy(asc(card.due), desc(card.updatedAt))
    : [];

  return (
    <div className="mx-auto w-full max-w-5xl p-4 sm:p-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Cards</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Cards assigned to you.
        </p>
      </header>

      {assignedCards.length ? (
        <ul className="mt-6 divide-y rounded-xl border bg-card">
          {assignedCards.map((item) => {
            return (
              <li key={item.id}>
                <Link
                  href={`/boards/${item.boardId}`}
                  className="flex flex-col gap-2 p-4 transition-colors hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">
                      {item.name}
                    </span>
                    <span className="mt-1 block truncate text-xs text-muted-foreground">
                      {item.boardName} · {item.listName}
                    </span>
                  </span>
                  {item.due && (
                    <span
                      className={`inline-flex shrink-0 items-center gap-1 rounded px-2 py-1 text-xs ${
                        isOverdue(item.due, item.dueComplete)
                          ? "bg-red-100 font-medium text-red-700"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <CalendarClock className="h-3.5 w-3.5" />
                      <span className={item.dueComplete ? "line-through" : undefined}>
                        Due {dueDateLabel(item.due)}
                      </span>
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <section className="mt-8 flex flex-col items-center rounded-xl border border-dashed p-10 text-center">
          <LayoutDashboard className="h-8 w-8 text-muted-foreground" />
          <h2 className="mt-4 font-medium">No cards assigned to you</h2>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Cards you&apos;re a member of will appear here.
          </p>
          <Button asChild variant="outline" className="mt-5">
            <Link href="/boards">Go to boards</Link>
          </Button>
        </section>
      )}
    </div>
  );
}
