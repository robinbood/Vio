import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { workspace, workspaceMember, user } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth/current-user";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Shield, User, Eye } from "lucide-react";
import { WorkspaceHeader } from "@/components/workspace/workspace-header";

export const metadata = {
  title: "Workspace members",
};

export default async function WorkspaceMembersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login");

  const [ws] = await db
    .select()
    .from(workspace)
    .where(eq(workspace.id, id))
    .limit(1);

  if (!ws) redirect("/workspaces");

  const membership = await db
    .select()
    .from(workspaceMember)
    .where(and(eq(workspaceMember.workspaceId, id), eq(workspaceMember.userId, currentUser.id)))
    .limit(1);

  if (!membership.length) redirect("/workspaces");

  const members = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      initials: user.initials,
      avatarColor: user.avatarColor,
      role: workspaceMember.role,
      joinedAt: workspaceMember.joinedAt,
    })
    .from(workspaceMember)
    .where(eq(workspaceMember.workspaceId, id))
    .innerJoin(user, eq(workspaceMember.userId, user.id));

  return (
    <div className="mx-auto max-w-4xl p-6 sm:p-8">
      <WorkspaceHeader workspace={ws} role={membership[0].role} />

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Members</h2>
          <Button size="sm" className="gap-1.5" disabled>
            <UserPlus className="h-4 w-4" /> Invite members
          </Button>
        </div>

        <div className="mt-4 divide-y rounded-xl border">
          {members.map((m) => {
            const initials =
              m.initials ?? m.name.split(" ").map((n) => n[0]).join("").slice(0, 2);
            return (
              <div key={m.id} className="flex items-center gap-3 p-4">
                <Avatar
                  className="h-10 w-10"
                  style={m.avatarColor ? { backgroundColor: m.avatarColor } : undefined}
                >
                  <AvatarFallback
                    className="text-sm font-semibold text-white"
                    style={m.avatarColor ? { backgroundColor: m.avatarColor } : undefined}
                  >
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{m.name}</div>
                  <div className="truncate text-xs text-muted-foreground">
                    {m.username ? `@${m.username}` : m.email}
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className="gap-1"
                >
                  {m.role === "admin" ? (
                    <Shield className="h-3 w-3" />
                  ) : m.role === "observer" ? (
                    <Eye className="h-3 w-3" />
                  ) : (
                    <User className="h-3 w-3" />
                  )}
                  {m.role}
                </Badge>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}