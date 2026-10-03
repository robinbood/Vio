import "server-only";

import { and, asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { board, card, list as listTable } from "@/lib/db/schema";
import {
  listUserBoards,
  findBoardAccess,
} from "@/lib/data/boards";
import { requireApiAuth } from "@/lib/api/auth";
import { createBoard as createBoardCore } from "@/lib/data/boards";

/**
 * Server-side implementation of the Trello-compatible API surface (/1/*).
 * Both the public routes and internal callers hit the same functions, so the
 * API and the UI share one source of truth.
 */
export const api = {
  requireApiAuth,

  /** List the calling user's boards, optionally requesting board contents. */
  async getBoards(userId: string, withCards = false, withLists = false) {
    const boards = await listUserBoards(userId);
    return boards.map((b) => ({
      id: b.id,
      name: b.name,
      desc: b.description ?? "",
      descData: undefined,
      closed: b.isClosed,
      url: b.url,
      shortUrl: b.url,
      prefs: b.prefs,
      memberships: [],
      organization: null,
      pos: 0,
      color: b.backgroundColor ?? undefined,
      backgrounds: [],
      premiumFieldsEnabled: false,
      icons: [],
      shortId: b.id,
      reminder: null,
      contents: withCards || withLists ? null : undefined,
    }));
  },

  async getBoardsByIds(ids: string[], userId: string) {
    if (!ids.length) return [];
    const boards = await listUserBoards(userId);
    return boards
      .filter((b) => ids.includes(b.id))
      .map((b) => ({
        id: b.id,
        name: b.name,
        closed: b.isClosed,
        url: b.url,
        shortUrl: b.url,
      }));
  },

  async getBoard(boardId: string, userId: string) {
    const access = await findBoardAccess(boardId, userId);
    if (!access) return null;
    const b = access.board;
    return {
      id: b.id,
      name: b.name,
      desc: b.description ?? "",
      descData: undefined,
      closed: b.isClosed,
      url: b.url,
      shortUrl: b.url,
      prefs: b.prefs,
      memberships: [],
      organization: null,
      pos: 0,
      color: b.backgroundColor ?? undefined,
      backgrounds: [],
      premiumFieldsEnabled: false,
      icons: [],
      shortId: b.id,
      reminder: null,
    };
  },

  async getLists(boardId: string, userId: string) {
    const access = await findBoardAccess(boardId, userId);
    if (!access) return [];
    const lists = await db
      .select()
      .from(listTable)
      .where(and(eq(listTable.boardId, boardId), eq(listTable.isClosed, false)))
      .orderBy(asc(listTable.pos));
    return lists.map((l) => ({
      id: l.id,
      name: l.name,
      closed: false,
      pos: l.pos,
      badges: { cards: 0, viewed: 0, subscribed: false },
    }));
  },

  async getCards(listId: string, userId: string) {
    const [listRow] = await db
      .select({ boardId: listTable.boardId })
      .from(listTable)
      .where(and(eq(listTable.id, listId), eq(listTable.isClosed, false)))
      .limit(1);
    if (!listRow) return [];
    const access = await findBoardAccess(listRow.boardId, userId);
    if (!access) return [];
    const cards = await db
      .select()
      .from(card)
      .where(
        and(
          eq(card.listId, listId),
          eq(card.isClosed, false),
          eq(card.boardId, listRow.boardId)
        )
      )
      .orderBy(asc(card.pos));
    return cards.map((c) => ({
      id: c.id,
      name: c.name,
      desc: c.desc,
      descData: c.descData,
      closed: c.isClosed,
      idList: c.listId,
      pos: c.pos,
      idShort: c.idShort,
      idBoard: c.boardId,
      idMembers: [] as string[],
      idLabels: [] as string[],
      idAttachments: [] as string[],
      idChecklists: [] as string[],
      url: c.url,
      shortUrl: c.url,
      due: c.due,
      dueReminder: null,
      start: c.start,
      checkItemStates: [] as { state: string; pos: number; name: string }[],
      badges: c.badges,
      shortId: c.idShort,
    }));
  },

  async getCard(cardId: string, userId: string) {
    const cardRow = await db.query.card.findFirst({
      where: eq(card.id, cardId),
    });
    if (!cardRow) return null;
    const access = await findBoardAccess(cardRow.boardId, userId);
    if (!access) return null;
    return {
      id: cardRow.id,
      name: cardRow.name,
      desc: cardRow.desc,
      descData: cardRow.descData,
      closed: cardRow.isClosed,
      idList: cardRow.listId,
      pos: cardRow.pos,
      idShort: cardRow.idShort,
      idBoard: cardRow.boardId,
      idMembers: [],
      idLabels: [],
      idAttachments: [],
      idChecklists: [],
      url: cardRow.url,
      shortUrl: cardRow.url,
      due: cardRow.due,
      badges: cardRow.badges,
      shortId: cardRow.idShort,
    };
  },

  async createBoard(input: {
    name: string;
    description: string | null;
    visibility: "private" | "workspace" | "public";
    workspaceId: string | null;
    defaultLists: boolean;
    ownerId: string;
  }) {
    const id = await createBoardCore(input);
    const createdBoard = await db.query.board.findFirst({
      where: eq(board.id, id),
      columns: { id: true, name: true, url: true },
    });
    if (!createdBoard) {
      throw new Error("Created board could not be loaded.");
    }
    return createdBoard;
  },
};
