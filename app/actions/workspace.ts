"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { workspace, workspaceMember } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { getCurrentUser } from "@/lib/auth/current-user";

export async function createWorkspace(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const name = formData.get("name")?.toString().trim();
  const displayName = formData.get("displayName")?.toString().trim() || null;
  const description = formData.get("description")?.toString().trim() || null;
  const visibility = (formData.get("visibility")?.toString() || "private") as
    | "private"
    | "public";

  if (!name || name.length < 2) {
    redirect("/workspaces/new?error=Workspace+name+must+be+at+least+2+characters.");
  }

  const id = nanoid(21);
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);

  await db.transaction(async (tx) => {
    await tx.insert(workspace).values({
      id,
      name: slug,
      displayName,
      description,
      visibility,
    });
    await tx.insert(workspaceMember).values({
      workspaceId: id,
      userId: user.id,
      role: "admin",
    });
  });

  redirect(`/workspaces/${id}`);
}