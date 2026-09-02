import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/current-user";
import { Button } from "@/components/ui/button";
import { Plus, Layout } from "lucide-react";
import { BOARD_BACKGROUNDS } from "@/lib/utils/trello-colors";

export default async function BoardsHome() {
  const user = await getCurrentUser();
  return (
    <div className="mx-auto max-w-6xl p-6 sm:p-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome{user ? `, ${user.name.split(" ")[0]}` : ""}
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

      <div className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Starred boards
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <EmptyBoardCard href="/boards/new" />
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Recently visited
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BOARD_BACKGROUNDS.slice(0, 3).map((bg) => (
            <EmptyBoardCard
              key={bg.value}
              href="/boards/new"
              previewStyle={bg.type === "color" ? { background: bg.value } : { background: bg.value }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function EmptyBoardCard({
  href,
  previewStyle,
}: {
  href: string;
  previewStyle?: React.CSSProperties;
}) {
  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-xl border bg-card shadow-sm transition hover:shadow-md"
    >
      <div
        className="h-20 w-full"
        style={previewStyle ?? { background: "var(--vio-violet)" }}
      />
      <div className="flex items-center gap-2 p-4">
        <Layout className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Create a new board</span>
      </div>
    </Link>
  );
}
