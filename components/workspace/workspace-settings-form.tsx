"use client";

import { useActionState } from "react";
import Link from "next/link";
import { updateWorkspace } from "@/app/actions/workspace";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { UpdateWorkspaceState } from "@/lib/validation/workspace";

type WorkspaceSettingsFormProps = {
  workspaceId: string;
  displayName: string;
  description: string | null;
  website: string | null;
  visibility: "private" | "public";
};

export function WorkspaceSettingsForm({
  workspaceId,
  displayName,
  description,
  website,
  visibility,
}: WorkspaceSettingsFormProps) {
  const action = updateWorkspace.bind(null, workspaceId);
  const [state, formAction, pending] = useActionState<
    UpdateWorkspaceState,
    FormData
  >(action, {});
  const errors = state.fieldErrors;

  return (
    <form action={formAction} className="space-y-6">
      <section className="space-y-4 rounded-xl border bg-card p-5">
        <div>
          <h2 className="font-semibold">Workspace details</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            These details are visible to workspace members.
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="displayName" className="text-sm font-medium">
            Workspace name
          </label>
          <Input
            id="displayName"
            name="displayName"
            defaultValue={displayName}
            maxLength={64}
            required
          />
          {errors?.displayName && (
            <p className="text-sm text-destructive">{errors.displayName}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Description
          </label>
          <Textarea
            id="description"
            name="description"
            defaultValue={description ?? ""}
            maxLength={256}
          />
          {errors?.description && (
            <p className="text-sm text-destructive">{errors.description}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="website" className="text-sm font-medium">
            Website
          </label>
          <Input
            id="website"
            name="website"
            type="url"
            defaultValue={website ?? ""}
            maxLength={256}
            placeholder="https://example.com"
          />
          {errors?.website && (
            <p className="text-sm text-destructive">{errors.website}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="visibility" className="text-sm font-medium">
            Visibility
          </label>
          <select
            id="visibility"
            name="visibility"
            defaultValue={visibility}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="private">Private</option>
            <option value="public">Public</option>
          </select>
          {errors?.visibility && (
            <p className="text-sm text-destructive">{errors.visibility}</p>
          )}
        </div>
      </section>

      {state.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}
      {state.success && (
        <p role="status" className="text-sm text-emerald-700">
          {state.success}
        </p>
      )}

      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save"}
        </Button>
        <Button asChild variant="outline">
          <Link href={`/workspaces/${workspaceId}`}>Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
