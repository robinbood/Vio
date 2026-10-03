import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { WorkspaceSettingsForm } from "@/components/workspace/workspace-settings-form";
import { requireWorkspaceAccess } from "@/lib/data/workspaces";

export const metadata = {
  title: "Workspace settings",
};

export default async function WorkspaceSettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const access = await requireWorkspaceAccess(id);
  if (access.role !== "admin") redirect(`/workspaces/${id}`);

  return (
    <div className="mx-auto w-full max-w-3xl p-4 sm:p-8">
      <div className="mb-6">
        <Button asChild variant="link" className="-ml-3 px-3">
          <Link href={`/workspaces/${id}`}>Back to workspace</Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">
          Workspace settings
        </h1>
      </div>
      <WorkspaceSettingsForm
        workspaceId={id}
        displayName={access.workspace.displayName ?? access.workspace.name}
        description={access.workspace.description}
        website={access.workspace.website}
        visibility={access.workspace.visibility}
      />
    </div>
  );
}
