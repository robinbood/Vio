import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Building2, Users, Settings } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type WorkspaceHeaderProps = {
  workspace: {
    id: string;
    name: string;
    displayName: string | null;
    description: string | null;
    visibility: string;
  };
  role: string;
};

export function WorkspaceHeader({ workspace, role }: WorkspaceHeaderProps) {
  const name = workspace.displayName ?? workspace.name;
  const isPublic = workspace.visibility === "public";

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500">
          <Building2 className="h-6 w-6 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight">{name}</h1>
            {isPublic && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                Public
              </span>
            )}
          </div>
          {workspace.description && (
            <p className="mt-0.5 text-sm text-muted-foreground">
              {workspace.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button asChild variant="outline" size="sm" className="gap-1.5">
          <Link href={`/workspaces/${workspace.id}/members`}>
            <Users className="h-4 w-4" /> Members
          </Link>
        </Button>
        {role === "admin" && (
          <Button asChild variant="ghost" size="sm" className="gap-1.5">
            <Link href={`/workspaces/${workspace.id}/settings`}>
              <Settings className="h-4 w-4" /> Settings
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}