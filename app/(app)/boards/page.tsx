import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { Button } from "@/components/ui/button";
import { Plus, Layout } from "lucide-react";
import { listStarredBoards, listUserBoards } from "@/lib/data/boards";

type BoardsHomeProps = {
  searchParams: Promise<{ starred?: string | string[] }>;
};

export default async function BoardsHome({ searchParams }: BoardsHomeProps) {
  const [user, params] = await Promise.all([
    getCurrentUser(),
    searchParams,
  ]);
  if (!user) redirect("/login");

  const starredOnly = params.starred === "1";
  const [allBoards, starredBoards] = await Promise.all([
    listUserBoards(user.id),
    listStarredBoards(user.id),
  ]);
  const openBoards = allBoards.filter(
    (board) => !board.isClosed && !board.isTemplate
  );
  const openStarredBoards = starredBoards.filter(
    (board) => !board.isClosed && openBoards.some((item) => item.id === board.id)
  );
  const starredIds = new Set(openStarredBoards.map((board) => board.id));
  const boardsToShow = starredOnly
    ? openStarredBoards
    : openBoards.filter((board) => !starredIds.has(board.id));

  return (
    <div className="mx-auto max-w-6xl p-6 sm:p-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome, {user.name.split(" ")[0]}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your boards, starred boards, and recently visited boards.
          </p>
        </div>
        <Button asChild variant="vio" className="gap-1.5">
          <Link href="/boards/new">
            <Plus className="h-4 w-4" /> Create board
          </Link>
        </Button>
      </div>

      <BoardSection
        title="Starred boards"
        boards={starredOnly ? boardsToShow : openStarredBoards}
        emptyMessage="Star your boards to find them here."
      />
      {!starredOnly && (
        <BoardSection
          title="Your boards"
          boards={boardsToShow}
          emptyMessage="Create your first board."
        />
      )}
    </div>
  );
}

function BoardSection({
  title,
  boards,
  emptyMessage,
}: {
  title: string;
  boards: Array<{
    id: string;
    name: string;
    backgroundColor: string | null;
    backgroundImage: string | null;
  }>;
  emptyMessage: string;
}) {
  return (
    <section className="mt-10">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h2>
      {boards.length ? (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {boards.map((board) => (
            <Link
              key={board.id}
              href={`/boards/${board.id}`}
              className="group block overflow-hidden rounded-xl border bg-card shadow-sm transition hover:shadow-md"
            >
              <div
                className="h-20 w-full bg-cover bg-center"
                style={{
                  background:
                    board.backgroundImage ??
                    board.backgroundColor ??
                    "var(--vio-violet)",
                }}
              />
              <div className="flex items-center gap-2 p-4">
                <Layout className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{board.name}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-4 rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
          {emptyMessage}
        </p>
      )}
    </section>
  );
}
