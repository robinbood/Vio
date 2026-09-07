import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { workspace, workspaceMember, board } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth/current-user";
import { Button } from "@/components/ui/button";
import { Plus, LayoutGrid, Users, Settings, Eye, EyeOff } from "lucide-react";
import { WorkspaceHeader } from "@/components/workspace/workspace-header";

export const metadata = {
  title: "Workspace",
};

export default async function WorkspaceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [ws] = await db
    .select()
    .from(workspace)
    .where(eq(workspace.id, id))
    .limit(1);

  if (!ws) redirect("/workspaces");

  const membership = await db
    .select()
    .from(workspaceMember)
    .where(and(eq(workspaceMember.workspaceId, id), eq(workspaceMember.userId, user.id)))
    .limit(1);

  if (!membership.length) redirect("/workspaces");

  const boards = await db
    .select()
    .from(board)
    .where(eq(board.workspaceId, id));

  return (
    <div className="mx-auto max-w-6xl p-6 sm:p-8">
      <WorkspaceHeader workspace={ws} role={membership[0].role} />

      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Boards
        </h2>
        <Button asChild variant="vio" size="sm" className="gap-1.5">
          <Link href="/boards/new">
            <Plus className="h-4 w-4" /> New board
          </Link>
        </Button>
      </div>

      {boards.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <LayoutGrid className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No boards yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your first board to start organizing work.
          </p>
          <Button asChild variant="vio" className="mt-6 gap-1.5">
            <Link href="/boards/new">
              <Plus className="h-4 w-4" /> Create board
            </Link>
          </Button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {boards.map((b) => (
            <Link
              key={b.id}
              href={`/boards/${b.id}`}
              className="group block overflow-hidden rounded-xl border bg-card shadow-sm transition hover:shadow-md"
            >
              <div
                className="flex h-20 items-center justify-center"
                style={{
                  background: b.backgroundImage ?? b.backgroundColor ?? "#6d28d9",
                }}
              >
                <LayoutGrid className="h-10 w-10 text-white" />
              </div>
              <div className="p-4">
                <h3 className="truncate text-base font-semibold">{b.name}</h3>
                {b.isClosed && (
                  <span className="text-xs text-muted-foreground">Archived</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}