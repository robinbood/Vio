import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  markAllNotificationsRead,
  markNotificationRead,
  openNotification,
} from "@/app/actions/notification";
import { requireUser } from "@/lib/data/workspaces";
import {
  getUnreadNotificationCount,
  listNotifications,
  parseNotificationCursor,
} from "@/lib/data/notifications";
import { Button } from "@/components/ui/button";
import { BellOff } from "lucide-react";

export const metadata: Metadata = { title: "Notifications" };

type NotificationItem = Awaited<ReturnType<typeof listNotifications>>["items"][number];

function relativeTime(date: Date): string {
  const seconds = Math.round((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function notificationMessage(item: NotificationItem): string {
  const actor = item.actorName ?? "Someone";
  const card = item.cardName ?? "a card";
  const board = item.boardName ?? "a board";
  switch (item.type) {
    case "mention":
      return `${actor} mentioned you on ${card}`;
    case "watching":
      return `There's new activity on ${card}`;
    case "dueSoon":
      return `${card} is due soon`;
    case "overdue":
      return `${card} is overdue`;
    case "addedToCard":
      return `${actor} added you to ${card}`;
    case "addedToBoard":
    case "invitedToBoard":
      return `${actor} invited you to ${board}`;
    case "invitedToWorkspace":
      return `${actor} invited you to a workspace`;
    case "removedFromBoard":
      return `You were removed from ${board}`;
    case "comment":
      return `${actor} commented on ${card}`;
    case "reaction":
      return `${actor} reacted to your comment on ${card}`;
    case "automationFailed":
      return `An automation failed on ${board}`;
  }
}

export default async function NotificationsPage({
  searchParams,
}: {
  searchParams: Promise<{ before?: string | string[] }>;
}) {
  const user = await requireUser();
  const params = await searchParams;
  const before = Array.isArray(params.before) ? params.before[0] : params.before;
  const cursor = parseNotificationCursor(before);
  if (before && !cursor) redirect("/notifications");
  const [page, unread] = await Promise.all([
    listNotifications(user.id, cursor),
    getUnreadNotificationCount(user.id),
  ]);

  return (
    <div className="mx-auto max-w-2xl p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Notifications
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {unread > 0
              ? `${unread} unread`
              : "You're all caught up"}
          </p>
        </div>
        {unread > 0 && (
          <form action={markAllNotificationsRead}>
            <Button type="submit" variant="outline" size="sm">
              Mark all as read
            </Button>
          </form>
        )}
      </div>

      {page.items.length === 0 && !cursor ? (
        <div className="mt-12 flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <BellOff className="h-6 w-6 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold">No notifications yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Activity on your boards — comments, due dates and mentions — shows
            up here.
          </p>
        </div>
      ) : page.items.length === 0 ? (
        <p className="mt-8 text-center text-sm text-muted-foreground">
          No older notifications.
        </p>
      ) : (
        <ul className="mt-6 divide-y rounded-xl border" role="list">
          {page.items.map((n) => (
            <li
              key={n.id}
              className={
                n.unread
                  ? "flex items-start gap-3 p-4"
                  : "flex items-start gap-3 p-4 opacity-70"
              }
            >
              <span
                aria-hidden
                className={
                  n.unread
                    ? "mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary"
                    : "mt-1.5 h-2 w-2 shrink-0 rounded-full bg-transparent"
                }
              />
              <div className="min-w-0 flex-1">
                {n.href ? (
                  <form action={openNotification.bind(null, n.id)}>
                    <button
                      type="submit"
                      className="text-left text-sm font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {notificationMessage(n)}
                    </button>
                  </form>
                ) : (
                  <p className="text-sm font-medium">
                    {notificationMessage(n)}
                  </p>
                )}
                <p className="mt-0.5 text-xs text-muted-foreground">
                  <time dateTime={n.createdAt.toISOString()}>
                    {relativeTime(n.createdAt)}
                  </time>
                </p>
              </div>
              {n.unread && (
                <form action={markNotificationRead.bind(null, n.id)}>
                  <Button type="submit" size="sm" variant="ghost">
                    Mark as read
                  </Button>
                </form>
              )}
            </li>
          ))}
        </ul>
      )}
      {(cursor || page.hasMore) && (
        <div className="mt-4 flex justify-end">
          {page.nextCursor && (
            <Button asChild variant="outline" size="sm">
              <Link
                href={`/notifications?before=${encodeURIComponent(page.nextCursor)}`}
              >
                Older notifications
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
