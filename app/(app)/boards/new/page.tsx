import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { listSidebarWorkspaces } from "@/lib/data/workspaces";
import { NewBoardForm } from "@/components/board/new-board-form";

export const metadata: Metadata = { title: "Create board" };

export default async function NewBoardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const workspaces = await listSidebarWorkspaces(user.id);

  return (
    <div className="mx-auto max-w-xl p-6 sm:p-8">
      <Link
        href="/boards"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to boards
      </Link>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">Create board</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Boards hold your lists and cards.
      </p>

      <NewBoardForm workspaces={workspaces} />
    </div>
  );
}
