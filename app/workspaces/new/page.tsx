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
import Link from "next/link";

export default function NewWorkspacePage() {
  return (
    <div className="mx-auto max-w-xl p-6 sm:p-8">
      <Link href="/workspaces" className="text-sm text-muted-foreground hover:text-foreground">
        ← Back to workspaces
      </Link>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">Create workspace</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        A workspace holds your boards and your team.
      </p>

      <form action={createWorkspace} className="mt-8 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name">Workspace name</Label>
          <Input
            id="name"
            name="name"
            required
            maxLength={64}
            placeholder="Acme Corp"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="displayName">Display name</Label>
          <Input
            id="displayName"
            name="displayName"
            maxLength={64}
            placeholder="Acme Corp (optional)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            name="description"
            maxLength={256}
            placeholder="What does this workspace do?"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="visibility">Visibility</Label>
          <Select name="visibility" defaultValue="private">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="private">Private</SelectItem>
              <SelectItem value="public">Public</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" variant="vio">
            Create workspace
          </Button>
          <Button asChild type="button" variant="outline">
            <Link href="/workspaces">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}