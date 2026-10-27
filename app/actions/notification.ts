"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { card, notification } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/current-user";
import { redirect } from "next/navigation";

function isNotificationId(id: string): boolean {
  return /^[a-f0-9]{24}$/i.test(id);
}

export async function markNotificationRead(id: string): Promise<void> {
  if (!isNotificationId(id)) throw new Error("Invalid notification id");
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  await db
    .update(notification)
    .set({ unread: false, dateRead: new Date() })
    .where(
      and(
        eq(notification.id, id),
        eq(notification.userId, user.id),
        eq(notification.unread, true)
      )
    );
  revalidatePath("/notifications");
  revalidatePath("/", "layout");
}

export async function openNotification(id: string): Promise<void> {
  if (!isNotificationId(id)) throw new Error("Invalid notification id");
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [item] = await db
    .select({
      boardId: notification.boardId,
      cardBoardId: card.boardId,
    })
    .from(notification)
    .leftJoin(card, eq(notification.cardId, card.id))
    .where(and(eq(notification.id, id), eq(notification.userId, user.id)))
    .limit(1);
  if (!item) redirect("/notifications");

  await db
    .update(notification)
    .set({ unread: false, dateRead: new Date() })
    .where(
      and(
        eq(notification.id, id),
        eq(notification.userId, user.id),
        eq(notification.unread, true)
      )
    );
  revalidatePath("/notifications");
  revalidatePath("/", "layout");
  const boardId = item.boardId ?? item.cardBoardId;
  redirect(boardId ? `/boards/${encodeURIComponent(boardId)}` : "/notifications");
}

export async function markAllNotificationsRead(): Promise<void> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  await db
    .update(notification)
    .set({ unread: false, dateRead: new Date() })
    .where(
      and(eq(notification.userId, user.id), eq(notification.unread, true))
    );
  revalidatePath("/notifications");
  revalidatePath("/", "layout");
}
