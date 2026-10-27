"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotificationsBell({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState(initialCount);

  const refreshCount = useCallback(async (signal?: AbortSignal) => {
    try {
      const response = await fetch("/api/notifications?summary=1", {
        cache: "no-store",
        signal,
      });
      if (!response.ok) {
        throw new Error(`Unread notification request failed (${response.status})`);
      }
      const result: { unreadCount: number } = await response.json();
      setCount(result.unreadCount);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      console.error("[notifications] unread count refresh failed:", error);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const initialRefresh = window.setTimeout(
      () => void refreshCount(controller.signal),
      0
    );
    const interval = window.setInterval(
      () => void refreshCount(controller.signal),
      30_000
    );
    const onFocus = () => void refreshCount(controller.signal);
    window.addEventListener("focus", onFocus);
    return () => {
      controller.abort();
      window.clearTimeout(initialRefresh);
      window.clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, [refreshCount]);

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
