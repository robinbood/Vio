import {
  notification,
  type Notification,
} from "@/lib/db/schema";
import { newId } from "@/lib/utils/ids";

export type NotificationCursor = {
  createdAt: string;
  id: string;
};

export type NotificationEvent = {
  recipientIds: readonly string[];
  actorId?: string;
  type: Notification["type"];
  actionId?: string | null;
  boardId?: string | null;
  cardId?: string | null;
  /** Stable key for retries; scheduled events should provide one explicitly. */
  dedupeKey?: string | null;
  data?: Record<string, unknown>;
};

/**
 * Build rows for insertion in the same transaction as the event that caused
 * them. The unique action/recipient/type index makes retries idempotent.
 */
export function notificationRowsForEvent(
  event: NotificationEvent
): Array<typeof notification.$inferInsert> {
  const recipients = [...new Set(event.recipientIds)].filter(
    (recipientId) => recipientId !== event.actorId
  );

  return recipients.map((userId) => ({
    id: newId(),
    userId,
    type: event.type,
    actionId: event.actionId ?? null,
    boardId: event.boardId ?? null,
    cardId: event.cardId ?? null,
    dedupeKey:
      event.dedupeKey ??
      (event.actionId ? `${event.type}:${event.actionId}` : null),
    data: event.data ?? {},
  }));
}

export function parseNotificationCursor(
  value: string | null | undefined
): NotificationCursor | null {
  if (!value) return null;
  const separator = value.lastIndexOf("~");
  if (separator < 0) return null;
  const timestamp = value.slice(0, separator);
  const id = value.slice(separator + 1);
  const match =
    /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})\.(\d{6})Z$/.exec(timestamp);
  if (!match) return null;
  const milliseconds = new Date(`${match[1]}.${match[2].slice(0, 3)}Z`);
  if (
    !/^[a-f0-9]{24}$/.test(id) ||
    Number.isNaN(milliseconds.getTime()) ||
    `${milliseconds.toISOString().slice(0, -1)}${match[2].slice(3)}Z` !==
      timestamp
  ) {
    return null;
  }
  return { createdAt: timestamp, id };
}

export function serializeNotificationCursor(
  cursor: NotificationCursor
): string {
  return `${cursor.createdAt}~${cursor.id}`;
}
