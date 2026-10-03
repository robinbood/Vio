"use server";

import { revalidatePath } from "next/cache";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { notification } from "@/lib/db/schema";
import { requireUser } from "@/lib/data/workspaces";

export async function listNotifications(userId: string) {
  return db
    .select()
    .from(notification)
    .where(eq(notification.userId, userId))
    .orderBy(desc(notification.createdAt))
    .limit(50);
}

export async function markAllNotificationsRead(): Promise<void> {
  const user = await requireUser();
  await db
    .update(notification)
    .set({ unread: false, dateRead: new Date() })
    .where(
      and(eq(notification.userId, user.id), eq(notification.unread, true))
    );
  revalidatePath("/notifications");
  revalidatePath("/", "layout");
}
