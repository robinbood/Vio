import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { workspace, workspaceMember } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth/current-user";
import { Button } from "@/components/ui/button";
import { Building2, Plus, Users, LayoutGrid } from "lucide-react";
import { WorkspaceCard } from "@/components/workspace/workspace-card";

export const metadata = {
  title: "Workspaces",
};

export default async function WorkspacesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const memberships = await db
    .select({
      workspace,
      role: workspaceMember.role,
    })
    .from(workspaceMember)
    .where(eq(workspaceMember.userId, user.id))
    .innerJoin(workspace, eq(workspaceMember.workspaceId, workspace.id));

  return (
    <div className="mx-auto max-w-6xl p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Workspaces</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your workspaces and the boards inside them.
          </p>
        </div>
        <Button asChild variant="vio" className="gap-1.5">
          <Link href="/workspaces/new">
            <Plus className="h-4 w-4" /> New workspace
          </Link>
        </Button>
      </div>

      {memberships.length === 0 ? (
        <div className="mt-12 flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Building2 className="h-6 w-6 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold">No workspaces yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Create a workspace to organize your boards and invite your team.
          </p>
          <Button asChild variant="vio" className="mt-6 gap-1.5">
            <Link href="/workspaces/new">
              <Plus className="h-4 w-4" /> Create your first workspace
            </Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {memberships.map(({ workspace: ws, role }) => (
            <WorkspaceCard key={ws.id} workspace={ws} role={role} />
          ))}
        </div>
      )}
    </div>
  );
}