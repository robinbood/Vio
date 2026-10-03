import type { Metadata } from "next";
import { markAllNotificationsRead } from "@/app/actions/notification";
import { requireUser } from "@/lib/data/workspaces";
import { listNotifications } from "@/app/actions/notification";
import { Button } from "@/components/ui/button";
import { BellOff } from "lucide-react";

export const metadata: Metadata = { title: "Notifications" };

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

export default async function NotificationsPage() {
  const user = await requireUser();
  const notifications = await listNotifications(user.id);
  const unread = notifications.filter((n) => n.unread).length;

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

      {notifications.length === 0 ? (
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
      ) : (
        <ul className="mt-6 divide-y rounded-xl border">
          {notifications.map((n) => (
            <li
              key={n.id}
              className={n.unread ? "flex gap-3 p-4" : "flex gap-3 p-4 opacity-70"}
            >
              <span
                aria-hidden
                className={
                  n.unread
                    ? "mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary"
                    : "mt-1.5 h-2 w-2 shrink-0 rounded-full bg-transparent"
                }
              />
              <div className="min-w-0">
                <p className="text-sm">
                  <span className="font-medium">{n.type.replace(/([A-Z])/g, " $1")}</span>
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {relativeTime(n.createdAt)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
