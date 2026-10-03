"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/current-user";
import { createBoard } from "@/lib/data/boards";
import { findWorkspaceAccess } from "@/lib/data/workspaces";
import {
  parseCreateBoardForm,
  type CreateBoardState,
} from "@/lib/validation/board";

export async function createBoardAction(
  _prevState: CreateBoardState,
  formData: FormData
): Promise<CreateBoardState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { values, state } = parseCreateBoardForm(formData);
  if (!values) return state;

  // A board placed in a workspace must be a member of it, otherwise the
  // workspace board list would surface it to people who never joined.
  if (values.workspaceId) {
    const access = await findWorkspaceAccess(values.workspaceId, user.id);
    if (!access) {
      return { error: "You don't have access to that workspace." };
    }
  }

  let boardId: string;
  try {
    boardId = await createBoard({
      name: values.name,
      description: values.description,
      visibility: values.visibility,
      workspaceId: values.workspaceId,
      defaultLists: values.defaultLists,
      ownerId: user.id,
    });
  } catch (error) {
    console.error("[board] create failed:", error);
    return { error: "We couldn't create that board. Please try again." };
  }

  revalidatePath("/boards");
  redirect(`/boards/${boardId}`);
}
