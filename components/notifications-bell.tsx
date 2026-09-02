"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotificationsBell() {
  // TODO: wire to real notifications count from server
  const count = 0;
  return (
    <Button
      asChild
      variant="ghost"
      size="icon"
      aria-label={`Notifications${count ? ` (${count} unread)` : ""}`}
      className="relative"
    >
      <Link href="/notifications">
        <Bell className="h-4 w-4" />
        {count > 0 && (
          <span className="absolute right-1.5 top-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </Link>
    </Button>
  );
}
