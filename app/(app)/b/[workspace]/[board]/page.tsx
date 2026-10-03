import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { listBoardContents, findBoardBySlug } from "@/lib/data/boards";
import { BoardView } from "@/components/board/board-view";
import { boardBackgroundStyle } from "@/components/board/board-background";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ workspace: string; board: string }>;
}): Promise<Metadata> {
  const { workspace, board: boardSlug } = await params;
  const user = await getCurrentUser();
  if (!user) return { title: boardSlug };

  const access = await findBoardBySlug(workspace, boardSlug, user.id);
  if (!access) return { title: boardSlug };
  return { title: `${access.board.name} — ${workspace}` };
}

export default async function BoardSlugPage({
  params,
}: {
  params: Promise<{ workspace: string; board: string }>;
}) {
  const { workspace, board: boardSlug } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const access = await findBoardBySlug(workspace, boardSlug, user.id);
  if (!access) notFound();

  const lists = await listBoardContents(access.board.id);

  return (
    <div
      className="flex min-h-full flex-col"
      style={boardBackgroundStyle(access.board)}
    >
      <div className="flex items-center gap-3 border-b border-white/20 px-4 py-3 text-white">
        <Link
          href={`/b/${workspace}`}
          className="text-sm text-white/80 hover:text-white"
        >
          ← {workspace}
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
