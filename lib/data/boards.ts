import "server-only";

import { notFound, redirect } from "next/navigation";
import { and, asc, desc, eq, inArray, isNotNull, or } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  board,
  boardMember,
  card,
  list as listTable,
  user,
  workspace,
  workspaceMember,
} from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth/current-user";
import { newId, slugify } from "@/lib/utils/ids";
import { findWorkspaceAccess, type MemberRole } from "@/lib/data/workspaces";

/** Trello's starter lists, enabled per board via `board.defaultLists`. */
export const DEFAULT_LIST_NAMES = ["To-Do", "Doing", "Done"] as const;

export type BoardAccess = {
  board: typeof board.$inferSelect;
  role: MemberRole;
};

/**
 * Resolve a board the caller may read by its internal id. Returns `null` for
 * both "no such board" and "not yours", so this cannot be used to probe which
 * board ids exist.
 */
export async function findBoardAccess(
  boardId: string,
  userId: string
): Promise<BoardAccess | null> {
  const [row] = await db
    .select({ board: board, role: boardMember.role })
    .from(board)
    .leftJoin(
      boardMember,
      and(eq(boardMember.boardId, board.id), eq(boardMember.userId, userId))
    )
    .where(eq(board.id, boardId))
    .limit(1);

  if (!row) return null;
  if (row.board.ownerId === userId) return { board: row.board, role: "admin" };

  const role = row.role;
  if (role) return { board: row.board, role };

  if (row.board.visibility === "public") {
    return { board: row.board, role: "observer" };
  }
  if (row.board.visibility === "workspace" && row.board.workspaceId) {
    const workspaceAccess = await findWorkspaceAccess(row.board.workspaceId, userId);
    if (workspaceAccess) return { board: row.board, role: workspaceAccess.role };
  }
  return null;
}

/** Resolve a board by workspace + board slug. Same access rules as `findBoardAccess`. */
export async function findBoardBySlug(
  workspaceSlug: string,
  boardSlug: string,
  userId: string
): Promise<BoardAccess | null> {
  const rows = await db
    .select({ board, role: boardMember.role })
    .from(board)
    .leftJoin(
      boardMember,
      and(eq(boardMember.boardId, board.id), eq(boardMember.userId, userId))
    )
    .innerJoin(
      workspace,
      and(
        eq(board.workspaceId, workspace.id),
        eq(workspace.name, workspaceSlug)
      )
    )
    .where(and(eq(board.url, boardSlug), eq(board.isClosed, false)))
    .limit(1);

  const row = rows[0];
  if (!row) return null;
  if (row.board.ownerId === userId) return { board: row.board, role: "admin" };

  if (row.role) return { board: row.board, role: row.role };
  if (row.board.visibility === "public") {
    return { board: row.board, role: "observer" };
  }
  if (row.board.visibility === "workspace" && row.board.workspaceId) {
    const workspaceAccess = await findWorkspaceAccess(row.board.workspaceId, userId);
    if (workspaceAccess) return { board: row.board, role: workspaceAccess.role };
  }
  return null;
}

/**
 * Page-level guard for a board. Private boards the caller cannot see produce a
 * 404 rather than a 403, matching Trello: the existence of someone else's
 * private board is not something to disclose.
 */
export async function requireBoardAccess(boardId: string): Promise<
  BoardAccess & { userId: string }
> {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login");

  const access = await findBoardAccess(boardId, currentUser.id);
  if (!access) notFound();

  return { ...access, userId: currentUser.id };
}

export type BoardListRow = typeof listTable.$inferSelect & {
  cards: Array<typeof card.$inferSelect>;
};

/** Lists in position order with their cards, for the board view. */
export async function listBoardContents(
  boardId: string
): Promise<BoardListRow[]> {
  const lists = await db
    .select()
    .from(listTable)
    .where(and(eq(listTable.boardId, boardId), eq(listTable.isClosed, false)))
    .orderBy(asc(listTable.pos));

  if (lists.length === 0) return [];

  const cards = await db
    .select()
    .from(card)
    .where(
      and(
        eq(card.boardId, boardId),
        eq(card.isClosed, false),
        inArray(
          card.listId,
          lists.map((l) => l.id)
        )
      )
    )
    .orderBy(asc(card.pos));

  const byList = new Map<string, Array<typeof card.$inferSelect>>();
  for (const row of cards) {
    if (!row.listId) continue;
    const bucket = byList.get(row.listId);
    if (bucket) bucket.push(row);
    else byList.set(row.listId, [row]);
  }

  return lists.map((l) => ({ ...l, cards: byList.get(l.id) ?? [] }));
}

/** Workspace members who can be added to a board. */
export async function listAssignableMembers(boardId: string) {
  return db
    .select({
      id: user.id,
      name: user.fullName,
      username: user.username,
      initials: user.initials,
      avatarColor: user.avatarColor,
    })
    .from(boardMember)
    .innerJoin(user, eq(boardMember.userId, user.id))
    .where(eq(boardMember.boardId, boardId));
}

/**
 * Create a board plus its starter lists in one transaction, and make the
 * creator an admin member. `pos` uses the same 16384-step increments Trello
 * does, so later reordering is a simple sparse update.
 */
export async function createBoard(input: {
  name: string;
  description: string | null;
  visibility: "private" | "workspace" | "public";
  workspaceId: string | null;
  defaultLists: boolean;
  ownerId: string;
}): Promise<string> {
  const id = newId();
  const base = slugify(input.name) || id;
  let url = base;
  for (let attempt = 2; await boardUrlExists(url); attempt += 1) {
    url = `${base}-${attempt}`;
  }

  await db.transaction(async (tx) => {
    await tx.insert(board).values({
      id,
      name: input.name,
      description: input.description,
      url,
      visibility: input.visibility,
      workspaceId: input.workspaceId,
      ownerId: input.ownerId,
      defaultLists: input.defaultLists,
      // 16384-step positions, matching Trello's spacing.
      nextCardShortId: 1,
    });

    await tx.insert(boardMember).values({
      boardId: id,
      userId: input.ownerId,
      role: "admin",
    });

    if (input.defaultLists) {
      await tx.insert(listTable).values(
        DEFAULT_LIST_NAMES.map((name, index) => ({
          id: newId(),
          boardId: id,
          name,
          pos: (index + 1) * 16384,
        }))
      );
    }
  });

  return id;
}

async function boardUrlExists(url: string): Promise<boolean> {
  const rows = await db
    .select({ id: board.id })
    .from(board)
    .where(eq(board.url, url))
    .limit(1);
  return rows.length > 0;
}

/** Boards the caller can see, newest first, for the home page. */
export async function listUserBoards(userId: string) {
  return db
    .select({
      id: board.id,
      name: board.name,
      description: board.description,
      url: board.url,
      backgroundColor: board.backgroundColor,
      backgroundImage: board.backgroundImage,
      isClosed: board.isClosed,
      isTemplate: board.isTemplate,
      visibility: board.visibility,
      ownerId: board.ownerId,
      workspaceId: board.workspaceId,
      prefs: board.prefs,
      createdAt: board.createdAt,
    })
    .from(board)
    .leftJoin(
      boardMember,
      and(
        eq(boardMember.boardId, board.id),
        eq(boardMember.userId, userId)
      )
    )
    .leftJoin(
      workspaceMember,
      and(
        eq(workspaceMember.workspaceId, board.workspaceId),
        eq(workspaceMember.userId, userId)
      )
    )
    .where(
      and(
        eq(board.isTemplate, false),
        or(
          eq(board.ownerId, userId),
          isNotNull(boardMember.boardId),
          eq(board.visibility, "public"),
          and(
            eq(board.visibility, "workspace"),
            isNotNull(workspaceMember.workspaceId)
          )
        )
      )
    )
    .orderBy(desc(board.createdAt));
}

/** Boards the caller has starred, for the home page. */
export async function listStarredBoards(userId: string) {
  return db
    .select({
      id: board.id,
      name: board.name,
      backgroundColor: board.backgroundColor,
      backgroundImage: board.backgroundImage,
      isClosed: board.isClosed,
    })
    .from(board)
    .innerJoin(boardMember, eq(boardMember.boardId, board.id))
    .where(and(eq(boardMember.userId, userId), eq(boardMember.starred, true)));
}
