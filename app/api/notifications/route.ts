import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import {
  getUnreadNotificationCount,
  listNotifications,
  parseNotificationCursor,
} from "@/lib/data/notifications";

export async function GET(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: { "Cache-Control": "private, no-store" } }
    );
  }

  const search = new URL(request.url).searchParams;
  const unreadCount = await getUnreadNotificationCount(currentUser.id);
  if (search.get("summary") === "1") {
    return NextResponse.json(
      { unreadCount },
      { headers: { "Cache-Control": "private, no-store" } }
    );
  }

  const cursorValue = search.get("before");
  const cursor = parseNotificationCursor(cursorValue);
  if (cursorValue && !cursor) {
    return NextResponse.json(
      { error: "Invalid notification cursor" },
      { status: 400, headers: { "Cache-Control": "private, no-store" } }
    );
  }
  const page = await listNotifications(currentUser.id, cursor);
  return NextResponse.json(
    { ...page, unreadCount },
    { headers: { "Cache-Control": "private, no-store" } }
  );
}
