import { describe, expect, it } from "vitest";
import {
  notificationRowsForEvent,
  parseNotificationCursor,
  serializeNotificationCursor,
} from "@/lib/notifications";

describe("notification event rows", () => {
  it("deduplicates recipients and excludes the actor", () => {
    const rows = notificationRowsForEvent({
      recipientIds: ["alice", "bob", "alice"],
      actorId: "alice",
      type: "comment",
      actionId: "a".repeat(24),
      boardId: "b".repeat(24),
      cardId: "c".repeat(24),
    });

    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      userId: "bob",
      type: "comment",
      actionId: "a".repeat(24),
      boardId: "b".repeat(24),
      cardId: "c".repeat(24),
      dedupeKey: `comment:${"a".repeat(24)}`,
      data: {},
    });
    expect(rows[0].id).toMatch(/^[a-f0-9]{24}$/);
  });

  it("preserves supplied notification data", () => {
    const data = { actorName: "Alex", context: "A card" };
    const rows = notificationRowsForEvent({
      recipientIds: ["bob"],
      type: "mention",
      data,
    });
    expect(rows[0].data).toEqual(data);
  });

  it("supports an explicit idempotency key for scheduled notifications", () => {
    const rows = notificationRowsForEvent({
      recipientIds: ["bob"],
      type: "dueSoon",
      cardId: "c".repeat(24),
      dedupeKey: `dueSoon:${"c".repeat(24)}:2026-10-15`,
    });
    expect(rows[0].dedupeKey).toBe(`dueSoon:${"c".repeat(24)}:2026-10-15`);
  });
});

describe("notification cursors", () => {
  it("round-trips an ISO date and opaque notification id", () => {
    const cursor = {
      createdAt: "2026-10-14T10:00:00.123456Z",
      id: "f".repeat(24),
    };

    expect(parseNotificationCursor(serializeNotificationCursor(cursor))).toEqual(
      cursor
    );
  });

  it.each([
    "not-a-cursor",
    "2026-10-14~bad",
    "2026-10-14T10:00:00Z~" + "0".repeat(24),
    "2026-02-30T10:00:00.123456Z~" + "0".repeat(24),
  ])(
    "rejects invalid cursor %s",
    (value) => {
      expect(parseNotificationCursor(value)).toBeNull();
    }
  );

  it("treats an absent cursor as the first page", () => {
    expect(parseNotificationCursor(null)).toBeNull();
  });
});
