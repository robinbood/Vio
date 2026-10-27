import "server-only";

import { and, count, desc, eq, lt, or, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  action,
  board,
  card,
  notification,
  user,
} from "@/lib/db/schema";
import {
  notificationRowsForEvent,
  serializeNotificationCursor,
  type NotificationCursor,
  type NotificationEvent,
} from "@/lib/notifications";

export const NOTIFICATIONS_PAGE_SIZE = 50;
export { parseNotificationCursor } from "@/lib/notifications";

export async function insertNotificationEvent(
  tx: Pick<typeof db, "insert">,
  event: NotificationEvent
): Promise<void> {
  const rows = notificationRowsForEvent(event);
  if (rows.length === 0) return;
  await tx
    .insert(notification)
    .values(rows)
    .onConflictDoNothing();
}

export async function getUnreadNotificationCount(userId: string): Promise<number> {
  const [result] = await db
    .select({ value: count() })
    .from(notification)
    .where(and(eq(notification.userId, userId), eq(notification.unread, true)));
  return result?.value ?? 0;
}

export async function listNotifications(
  userId: string,
  cursor?: NotificationCursor | null
) {
  const conditions = [eq(notification.userId, userId)];
  if (cursor) {
    const cursorTimestamp = sql`${cursor.createdAt}::timestamptz`;
    const cursorCondition = or(
      lt(notification.createdAt, cursorTimestamp),
      and(
        eq(notification.createdAt, cursorTimestamp),
        lt(notification.id, cursor.id)
      )
    );
    if (cursorCondition) conditions.push(cursorCondition);
  }

  const rows = await db
    .select({
      id: notification.id,
      type: notification.type,
      data: notification.data,
      unread: notification.unread,
      createdAt: notification.createdAt,
      cursorCreatedAt: sql<string>`to_char(
        ${notification.createdAt} AT TIME ZONE 'UTC',
        'YYYY-MM-DD"T"HH24:MI:SS.US"Z"'
      )`,
      boardId: notification.boardId,
      boardName: board.name,
      cardId: notification.cardId,
      cardName: card.name,
      actorName: user.fullName,
      actionActorName: user.name,
    })
    .from(notification)
    .leftJoin(action, eq(notification.actionId, action.id))
    .leftJoin(user, eq(action.memberCreatorId, user.id))
    .leftJoin(board, eq(notification.boardId, board.id))
    .leftJoin(card, eq(notification.cardId, card.id))
    .where(and(...conditions))
    .orderBy(desc(notification.createdAt), desc(notification.id))
    .limit(NOTIFICATIONS_PAGE_SIZE + 1);

  const hasMore = rows.length > NOTIFICATIONS_PAGE_SIZE;
  const items = rows.slice(0, NOTIFICATIONS_PAGE_SIZE).map((row) => ({
    ...row,
    actorName:
      row.actorName ??
      row.actionActorName ??
      (typeof row.data?.actorName === "string" ? row.data.actorName : null),
    href: row.boardId ? `/boards/${encodeURIComponent(row.boardId)}` : null,
  }));
  const last = items.at(-1);

  return {
    items,
    hasMore,
    nextCursor:
      hasMore && last
        ? serializeNotificationCursor({
            createdAt: last.cursorCreatedAt,
            id: last.id,
          })
        : null,
  };
}
