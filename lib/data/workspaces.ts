import "server-only";

import { redirect } from "next/navigation";
import { and, eq, exists, or, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { board, boardMember, user, workspace, workspaceMember } from "@/lib/db/schema";
import { getCurrentUser, type CurrentUser } from "@/lib/auth/current-user";

export type MemberRole = "admin" | "normal" | "observer";

const ROLE_RANK: Record<MemberRole, number> = {
  observer: 0,
  normal: 1,
  admin: 2,
};

export function hasMinimumRole(role: MemberRole, minimum: MemberRole): boolean {
  return ROLE_RANK[role] >= ROLE_RANK[minimum];
}

export class UnauthenticatedError extends Error {
  constructor() {
    super("UNAUTHENTICATED");
    this.name = "UnauthenticatedError";
  }
}

/**
 * The single door for authenticated server code. Pages, server actions and
 * route handlers resolve the caller through here instead of reading cookies
 * themselves — `proxy.ts` only checks that a cookie *exists*, it never
 * validates the session it points at.
 */
export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) throw new UnauthenticatedError();
  return user;
}

export type WorkspaceAccess = {
  workspace: typeof workspace.$inferSelect;
  role: MemberRole;
};

/**
 * Resolve a workspace the caller belongs to. Returns `null` both when the
 * workspace does not exist and when the caller is not a member, so this
 * lookup cannot be used to probe which workspace ids are real.
 */
export async function findWorkspaceAccess(
  workspaceId: string,
  userId: string
): Promise<WorkspaceAccess | null> {
  const [row] = await db
    .select({ workspace: workspace, role: workspaceMember.role })
    .from(workspaceMember)
    .innerJoin(workspace, eq(workspaceMember.workspaceId, workspace.id))
    .where(
      and(
        eq(workspaceMember.workspaceId, workspaceId),
        eq(workspaceMember.userId, userId)
      )
    )
    .limit(1);

  return row ?? null;
}

/**
 * Page-level guard: resolves the caller and their workspace membership in one
 * call, redirecting when either check fails. Both workspace routes used to
 * carry their own copy of this sequence.
 */
export async function requireWorkspaceAccess(
  workspaceId: string
): Promise<WorkspaceAccess & { userId: string }> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const access = await findWorkspaceAccess(workspaceId, user.id);
  if (!access) redirect("/workspaces");

  return { ...access, userId: user.id };
}

export type WorkspaceMemberRow = {
  id: string;
  name: string;
  /** Only populated for admins — see `listWorkspaceMembers`. */
  email: string | null;
  username: string | null;
  initials: string | null;
  avatarColor: string | null;
  role: MemberRole;
  joinedAt: Date;
};

/**
 * Members of a workspace. Email addresses are only returned to admins, because
 * they are the addressable identifier used for invites and notifications —
 * a read-only `observer` has no business harvesting them.
 */
export async function listWorkspaceMembers(
  workspaceId: string,
  viewerRole: MemberRole
): Promise<Array<WorkspaceMemberRow>> {
  const canSeeEmail = hasMinimumRole(viewerRole, "admin");

  const rows = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      initials: user.initials,
      avatarColor: user.avatarColor,
      role: workspaceMember.role,
      joinedAt: workspaceMember.joinedAt,
    })
    .from(workspaceMember)
    .innerJoin(user, eq(workspaceMember.userId, user.id))
    .where(eq(workspaceMember.workspaceId, workspaceId))
    .orderBy(workspaceMember.joinedAt);

  return rows.map((row) => ({
    ...row,
    email: canSeeEmail ? row.email : null,
  }));
}

/**
 * Compact summary for the sidebar: the caller's workspaces and how many
 * visible boards each holds. Board counts go through the same visibility rules
 * as the workspace board grid, so the number cannot leak private boards.
 */
export async function listSidebarWorkspaces(
  userId: string
): Promise<Array<{ id: string; name: string; boardCount: number }>> {
  const rows = await db
    .select({
      id: workspace.id,
      name: workspace.name,
      displayName: workspace.displayName,
      boardId: board.id,
      boardVisibility: board.visibility,
      boardOwnerId: board.ownerId,
    })
    .from(workspaceMember)
    .innerJoin(workspace, eq(workspaceMember.workspaceId, workspace.id))
    .leftJoin(board, eq(board.workspaceId, workspace.id))
    .where(eq(workspaceMember.userId, userId))
    .orderBy(workspaceMember.joinedAt);

  const summaries = new Map<string, { id: string; name: string; boardCount: number }>();
  const memberBoardIds = new Set(
    (
      await db
        .select({ boardId: boardMember.boardId })
        .from(boardMember)
        .where(eq(boardMember.userId, userId))
    ).map((r) => r.boardId)
  );

  for (const row of rows) {
    const label = row.displayName ?? row.name;
    const entry = summaries.get(row.id) ?? {
      id: row.id,
      name: label,
      boardCount: 0,
    };
    summaries.set(row.id, entry);

    if (!row.boardId) continue;
    const visible =
      row.boardOwnerId === userId ||
      row.boardVisibility !== "private" ||
      memberBoardIds.has(row.boardId);
    if (visible) entry.boardCount += 1;
  }

  return [...summaries.values()];
}

/**
 * Boards inside a workspace that this user is allowed to see.
 *
 * Board membership and board visibility are independent of workspace
 * membership: a workspace `observer` must not be able to enumerate the names
 * and ids of private boards they were never invited to.
 */
export async function listVisibleBoards(
  workspaceId: string,
  userId: string
): Promise<Array<typeof board.$inferSelect>> {
  const isMemberOfBoard = exists(
    db
      .select({ one: sql`1` })
      .from(boardMember)
      .where(
        and(eq(boardMember.boardId, board.id), eq(boardMember.userId, userId))
      )
  );

  const rows = await db
    .select({ board: board })
    .from(board)
    .where(
      and(
        eq(board.workspaceId, workspaceId),
        eq(board.isTemplate, false),
        eq(board.isClosed, false),
        or(
          eq(board.ownerId, userId),
          eq(board.visibility, "workspace"),
          eq(board.visibility, "public"),
          isMemberOfBoard
        )
      )
    )
    .orderBy(board.createdAt);

  return rows.map((row) => row.board);
}
