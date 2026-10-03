import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { and, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { board, boardMember, user } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth/current-user";
import { listUserBoards } from "@/lib/data/boards";
import { Button } from "@/components/ui/button";
import { Layout } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const [row] = await db
    .select({ name: user.name })
    .from(user)
    .where(eq(user.username, username))
    .limit(1);
  return {
    title: row?.name ? `${row.name} — ${username}` : username,
  };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login");

  const target = await db.query.user.findFirst({
    where: eq(user.username, username),
  });

  if (!target) {
    return (
      <div className="mx-auto max-w-2xl p-6 sm:p-8">
        <h1 className="text-2xl font-semibold tracking-tight">Not found</h1>
        <p className="mt-2 text-muted-foreground">
          No user with the username @{username}.
        </p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/boards">Back to boards</Link>
        </Button>
      </div>
    );
  }

  const isOwn = target.id === currentUser.id;

  const accessibleBoardIds = (await listUserBoards(currentUser.id))
    .filter((accessibleBoard) => accessibleBoard.ownerId === target.id)
    .map((accessibleBoard) => accessibleBoard.id);
  const rows = accessibleBoardIds.length
    ? await db
        .select({
          board,
          starred: boardMember.starred,
        })
        .from(board)
        .leftJoin(
          boardMember,
          and(
            eq(boardMember.boardId, board.id),
            eq(boardMember.userId, currentUser.id)
          )
        )
        .where(
          and(
            eq(board.ownerId, target.id),
            inArray(board.id, accessibleBoardIds)
          )
        )
        .orderBy((t) => [desc(t.starred ?? false), desc(t.board.createdAt)])
    : [];

  return (
    <div className="mx-auto max-w-6xl p-6 sm:p-8">
      <div className="flex items-center gap-4">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full text-white"
          style={{ backgroundColor: target.avatarColor ?? "#6d28d9" }}
        >
          <span className="text-lg font-semibold">
            {(target.initials ?? target.name.slice(0, 2).toUpperCase()) || "??"}
          </span>
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{target.fullName ?? target.name}</h1>
          <p className="text-sm text-muted-foreground">@{username}</p>
        </div>
        {isOwn && (
          <Button asChild variant="outline" className="ml-auto gap-1.5">
            <Link href="/settings">Edit profile</Link>
          </Button>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Boards ({rows.length})
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map(({ board, starred }) => (
            <Link
              key={board.id}
              href={`/boards/${board.id}`}
              className="group block overflow-hidden rounded-xl border bg-card shadow-sm transition hover:shadow-md"
            >
              <div
                className="h-20 w-full"
                style={{
                  background: board.backgroundImage ?? board.backgroundColor ?? "var(--vio-violet)",
                }}
              />
              <div className="flex items-center gap-2 p-4">
                <Layout className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{board.name}</span>
                {starred && (
                  <span className="ml-auto text-xs text-amber-500">★</span>
                )}
              </div>
            </Link>
          ))}
          {!rows.length && (
            <div className="rounded-xl border border-dashed p-12 text-center">
              <p className="text-sm text-muted-foreground">
                @{username} has no boards yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
