import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { listBoardContents, requireBoardAccess } from "@/lib/data/boards";
import { BoardView } from "@/components/board/board-view";
import { boardBackgroundStyle } from "@/components/board/board-background";

export const metadata: Metadata = { title: "Board" };

export default async function BoardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // A cookie-less visitor must reach the login page, not a 404.
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login");

  const access = await requireBoardAccess(id);
  const lists = await listBoardContents(id);

  return (
    <div
      className="flex min-h-full flex-col"
      style={boardBackgroundStyle(access.board)}
    >
      <div className="flex items-center gap-3 border-b border-white/20 px-4 py-3 text-white">
        <Link
          href="/boards"
          className="text-sm text-white/80 hover:text-white"
        >
          ← Boards
        </Link>
        <h1 className="truncate text-lg font-semibold">{access.board.name}</h1>
        {access.board.visibility !== "private" && (
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs capitalize">
            {access.board.visibility}
          </span>
        )}
      </div>

      <BoardView lists={lists} />
    </div>
  );
}
