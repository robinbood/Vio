import Link from "next/link";
import { and, desc, eq, inArray } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { action as actionTable, board, card, user } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth/current-user";
import { listUserBoards } from "@/lib/data/boards";

type ActionType = typeof actionTable.$inferSelect.type;

const actionLabels: Partial<Record<ActionType, string>> = {
  createBoard: "created a board",
  updateBoard: "updated a board",
  closeBoard: "closed a board",
  reopenBoard: "reopened a board",
  createList: "created a list",
  updateList: "updated a list",
  moveList: "moved a list",
  archiveList: "archived a list",
  createCard: "created a card",
  updateCard: "updated a card",
  moveCard: "moved a card",
  archiveCard: "archived a card",
  unarchiveCard: "restored a card",
  commentCard: "commented on a card",
  addMemberToCard: "added a member to a card",
  addLabelToCard: "added a label to a card",
  addAttachmentToCard: "added an attachment to a card",
};

export const metadata = {
  title: "Activity",
};

export default async function UserActivityPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login");

  const profile = await db.query.user.findFirst({
    where: eq(user.username, username),
    columns: { id: true, name: true, fullName: true },
  });
  if (!profile) notFound();

  const visibleBoardIds = (await listUserBoards(currentUser.id)).map(
    (visibleBoard) => visibleBoard.id
  );
  const activities = visibleBoardIds.length
    ? await db
        .select({
          id: actionTable.id,
          type: actionTable.type,
          createdAt: actionTable.createdAt,
          boardId: board.id,
          boardName: board.name,
          cardName: card.name,
        })
        .from(actionTable)
        .innerJoin(board, eq(board.id, actionTable.boardId))
        .leftJoin(card, eq(card.id, actionTable.cardId))
        .where(
          and(
            eq(actionTable.memberCreatorId, profile.id),
            inArray(actionTable.boardId, visibleBoardIds)
          )
        )
        .orderBy(desc(actionTable.createdAt))
        .limit(50)
    : [];

  const displayName = profile.fullName ?? profile.name;

  return (
    <div className="mx-auto w-full max-w-3xl p-4 sm:p-8">
      <header>
        <Link
          href={`/u/${username}`}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          @{username}
        </Link>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Activity</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Recent activity from {displayName}.
        </p>
      </header>

      {activities.length ? (
        <ol className="mt-6 divide-y rounded-xl border bg-card">
          {activities.map((item) => (
            <li key={item.id} className="p-4">
              <p className="text-sm">
                <span className="font-medium">{displayName}</span>{" "}
                {actionLabels[item.type] ?? item.type}
                {item.cardName && (
                  <>
                    {" "}
                    <span className="font-medium">{item.cardName}</span>
                  </>
                )}
                {" in "}
                <Link
                  href={`/boards/${item.boardId}`}
                  className="font-medium text-vio hover:underline"
                >
                  {item.boardName}
                </Link>
              </p>
              <time
                dateTime={item.createdAt.toISOString()}
                className="mt-1 block text-xs text-muted-foreground"
              >
                {new Intl.DateTimeFormat("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(item.createdAt)}
              </time>
            </li>
          ))}
        </ol>
      ) : (
        <div className="mt-8 rounded-xl border border-dashed p-10 text-center">
          <h2 className="font-medium">No activity yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Activity on boards you can view will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
