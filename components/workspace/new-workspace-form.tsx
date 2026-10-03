"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createWorkspace } from "@/app/actions/workspace";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { CreateWorkspaceState } from "@/lib/validation/workspace";

const initialState: CreateWorkspaceState = {};

export function NewWorkspaceForm() {
  const [state, formAction, pending] = useActionState(
    createWorkspace,
    initialState
  );

  return (
    <form action={formAction} className="mt-8 space-y-5">
      {state.error && (
        <p
          role="alert"
          className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {state.error}
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Workspace name</Label>
        <Input
          id="name"
          name="name"
          required
          maxLength={64}
          placeholder="Acme Corp"
          aria-invalid={Boolean(state.fieldErrors?.name)}
          aria-describedby={state.fieldErrors?.name ? "name-error" : undefined}
        />
        {state.fieldErrors?.name && (
          <p id="name-error" className="text-sm text-destructive">
            {state.fieldErrors.name}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="displayName">Display name</Label>
        <Input
          id="displayName"
          name="displayName"
          maxLength={64}
          placeholder="Acme Corp (optional)"
        />
        {state.fieldErrors?.displayName && (
          <p className="text-sm text-destructive">
            {state.fieldErrors.displayName}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          name="description"
          maxLength={256}
          placeholder="What does this workspace do?"
        />
        {state.fieldErrors?.description && (
          <p className="text-sm text-destructive">
            {state.fieldErrors.description}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="visibility">Visibility</Label>
        <Select name="visibility" defaultValue="private">
          <SelectTrigger id="visibility">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="private">Private</SelectItem>
            <SelectItem value="public">Public</SelectItem>
          </SelectContent>
        </Select>
        {state.fieldErrors?.visibility && (
          <p className="text-sm text-destructive">
            {state.fieldErrors.visibility}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" variant="vio" disabled={pending}>
          {pending ? "Creating…" : "Create workspace"}
        </Button>
        <Button asChild type="button" variant="outline">
          <Link href="/workspaces">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
