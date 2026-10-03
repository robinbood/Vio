import Link from "next/link";
import { NewWorkspaceForm } from "@/components/workspace/new-workspace-form";

export default function NewWorkspacePage() {
  return (
    <div className="mx-auto max-w-xl p-6 sm:p-8">
      <Link
        href="/workspaces"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to workspaces
      </Link>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">
        Create workspace
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        A workspace holds your boards and your team.
      </p>

      <NewWorkspaceForm />
    </div>
  );
}