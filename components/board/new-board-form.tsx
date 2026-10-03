"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createBoardAction } from "@/app/actions/board";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CreateBoardState } from "@/lib/validation/board";

export type BoardWorkspaceOption = { id: string; name: string };

const initialState: CreateBoardState = {};

export function NewBoardForm({
  workspaces,
}: {
  workspaces: BoardWorkspaceOption[];
}) {
  const [state, formAction, pending] = useActionState(
    createBoardAction,
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
        <Label htmlFor="name">Board name</Label>
        <Input
          id="name"
          name="name"
          required
          maxLength={64}
          placeholder="Product Roadmap"
          aria-invalid={Boolean(state.fieldErrors?.name)}
        />
        {state.fieldErrors?.name && (
          <p className="text-sm text-destructive">{state.fieldErrors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          name="description"
          maxLength={256}
          placeholder="What is this board for? (optional)"
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
            <SelectItem value="workspace">Workspace</SelectItem>
            <SelectItem value="public">Public</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {workspaces.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="workspaceId">Workspace</Label>
          <Select name="workspaceId" defaultValue="">
            <SelectTrigger id="workspaceId">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">No workspace</SelectItem>
              {workspaces.map((ws) => (
                <SelectItem key={ws.id} value={ws.id}>
                  {ws.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex items-center gap-2">
        <Checkbox id="defaultLists" name="defaultLists" defaultChecked />
        <Label htmlFor="defaultLists" className="cursor-pointer font-normal">
          Add To-Do, Doing and Done lists
        </Label>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" variant="vio" disabled={pending}>
          {pending ? "Creating…" : "Create board"}
        </Button>
        <Button asChild type="button" variant="outline">
          <Link href="/boards">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
