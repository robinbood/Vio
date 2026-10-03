"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { db } from "@/lib/db";
import { workspace, workspaceMember } from "@/lib/db/schema";
import { eq, like, or } from "drizzle-orm";
import { findWorkspaceAccess } from "@/lib/data/workspaces";
import { ensureUniqueSlug, newId, slugify } from "@/lib/utils/ids";
import {
  parseCreateWorkspaceForm,
  parseUpdateWorkspaceForm,
  type CreateWorkspaceState,
  type UpdateWorkspaceState,
} from "@/lib/validation/workspace";

function isWorkspaceNameConflict(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "constraint" in error &&
    error.code === "23505" &&
    error.constraint === "workspace_name_idx"
  );
}

export async function createWorkspace(
  _previousState: CreateWorkspaceState,
  formData: FormData
): Promise<CreateWorkspaceState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { values, state } = parseCreateWorkspaceForm(formData);
  if (!values) return state;

  const baseSlug = slugify(values.name) || newId();
  let workspaceId: string | undefined;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const id = newId();
    try {
      const existingNames = await db
        .select({ name: workspace.name })
        .from(workspace)
        .where(
          or(
            eq(workspace.name, baseSlug),
            like(workspace.name, `${baseSlug}-%`)
          )
        );
      const slug = ensureUniqueSlug(
        baseSlug,
        existingNames.map(({ name }) => name)
      );

      await db.transaction(async (tx) => {
        await tx.insert(workspace).values({
          id,
          name: slug,
          displayName: values.displayName,
          description: values.description,
          visibility: values.visibility,
        });
        await tx.insert(workspaceMember).values({
          workspaceId: id,
          userId: user.id,
          role: "admin",
        });
      });
      workspaceId = id;
      break;
    } catch (error) {
      if (isWorkspaceNameConflict(error) && attempt < 2) continue;
      console.error("[workspace] create failed:", error);
      return { error: "We couldn't create that workspace. Please try again." };
    }
  }

  if (!workspaceId) {
    return { error: "We couldn't create that workspace. Please try again." };
  }
  revalidatePath("/workspaces");
  redirect(`/workspaces/${workspaceId}`);
}

export async function updateWorkspace(
  workspaceId: string,
  _previousState: UpdateWorkspaceState,
  formData: FormData
): Promise<UpdateWorkspaceState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const access = await findWorkspaceAccess(workspaceId, user.id);
  if (!access) return { error: "You don't have access to that workspace." };
  if (access.role !== "admin") {
    return { error: "Only workspace admins can change these settings." };
  }

  const { values, state } = parseUpdateWorkspaceForm(formData);
  if (!values) return state;

  try {
    await db
      .update(workspace)
      .set({
        displayName: values.displayName,
        description: values.description,
        website: values.website,
        visibility: values.visibility,
        updatedAt: new Date(),
      })
      .where(eq(workspace.id, workspaceId));
  } catch (error) {
    console.error("[workspace] settings update failed:", error);
    return {
      error: "We couldn't save those workspace settings. Please try again.",
    };
  }

  revalidatePath(`/workspaces/${workspaceId}`);
  revalidatePath(`/workspaces/${workspaceId}/settings`);
  revalidatePath("/workspaces");
  return { success: "Workspace settings saved." };
}
