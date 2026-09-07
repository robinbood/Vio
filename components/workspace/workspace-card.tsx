import Link from "next/link";
import { Building2, LayoutGrid, Users, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

type WorkspaceCardProps = {
  workspace: {
    id: string;
    name: string;
    displayName: string | null;
    description: string | null;
    visibility: string;
  };
  role: string;
};

export function WorkspaceCard({ workspace, role }: WorkspaceCardProps) {
  const name = workspace.displayName ?? workspace.name;
  const isPublic = workspace.visibility === "public";

  return (
    <Link
      href={`/workspaces/${workspace.id}`}
      className="group block overflow-hidden rounded-xl border bg-card shadow-sm transition hover:shadow-md"
    >
      <div className="flex h-20 items-center justify-center bg-gradient-to-br from-violet-500 to-indigo-500">
        <Building2 className="h-10 w-10 text-white" />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-base font-semibold">{name}</h3>
          {isPublic && (
            <Badge variant="secondary" className="text-[10px]">
              Public
            </Badge>
          )}
        </div>
        {workspace.description && (
          <p className="mt-1 truncate text-sm text-muted-foreground">
            {workspace.description}
          </p>
        )}
        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <LayoutGrid className="h-3.5 w-3.5" /> Boards
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" /> Members
          </span>
          <span className="ml-auto flex items-center gap-1">
            <Shield className="h-3.5 w-3.5" /> {role}
          </span>
        </div>
      </div>
    </Link>
  );
}