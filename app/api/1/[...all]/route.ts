import { NextResponse } from "next/server";
import { api } from "@/lib/api";
import { findWorkspaceAccess } from "@/lib/data/workspaces";
import { createBoardSchema } from "@/lib/validation/board";
import { z } from "zod";

export async function GET(request: Request, { params }: { params: Promise<{ all: string[] }> }) {
  const { all } = await params;
  const auth = await api.requireApiAuth(request.headers);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [first, ...rest] = all;
  const search = new URL(request.url).searchParams;

  switch (first) {
    case "members":
      if (rest.length === 1 && rest[0] === "me") {
        return NextResponse.json({
          id: auth.user.id,
          username: null,
          displayName: auth.user.name,
          initials: null,
          avatarUrl: null,
          avatarColor: null,
          bio: null,
          actionsCount: 0,
          uploadsCount: 0,
          uploadedBytes: 0,
          dateLastLogin: null,
          confirmed: true,
          premium: false,
        });
      }
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    case "boards": {
      if (rest.length === 2 && rest[1] === "lists") {
        // /1/boards/{boardId}/lists
        const boardId = rest[0];
        const lists = await api.getLists(boardId, auth.user.id);
        return NextResponse.json(lists);
      }
      if (rest.length === 1) {
        const board = await api.getBoard(rest[0], auth.user.id);
        if (!board) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json(board);
      }
      if (rest.length > 0) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      // /1/boards with optional query params
      const ids = search.get("ids");
      if (ids) {
        const boards = await api.getBoardsByIds(ids.split(","), auth.user.id);
        return NextResponse.json(boards);
      }
      const cards = search.get("cards") === "1";
      const lists = search.get("lists") === "1";
      const boards = await api.getBoards(auth.user.id, cards, lists);
      return NextResponse.json(boards);
    }

    case "lists": {
      // /1/lists/{listId}/cards
      if (rest.length !== 2 || rest[1] !== "cards") {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      const listId = rest[0] as string;
      const cards = await api.getCards(listId, auth.user.id);
      return NextResponse.json(cards);
    }

    case "cards": {
      // /1/cards/{id}
      if (rest.length !== 1) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      const card = await api.getCard(rest[0] as string, auth.user.id);
      if (!card) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(card);
    }

    default:
      return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ all: string[] }> }) {
  const { all } = await params;
  const auth = await api.requireApiAuth(request.headers);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [first] = all;
  if (first === "boards") {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const objectBody = z.record(z.string(), z.unknown()).safeParse(body);
    if (!objectBody.success) {
      return NextResponse.json({ error: "Expected a JSON object" }, { status: 400 });
    }
    const input = objectBody.data;
    const parsed = createBoardSchema.safeParse({
      name: input.name,
      description: input.desc ?? input.description,
      visibility: input.visibility,
      workspaceId: input.idOrganization ?? input.workspaceId ?? "",
      defaultLists: input.defaultLists ?? true,
    });
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid board details", issues: parsed.error.issues },
        { status: 400 }
      );
    }
    if (
      parsed.data.workspaceId &&
      !(await findWorkspaceAccess(parsed.data.workspaceId, auth.user.id))
    ) {
      return NextResponse.json(
        { error: "You don't have access to that workspace." },
        { status: 403 }
      );
    }

    try {
      const createdBoard = await api.createBoard({
        ...parsed.data,
        ownerId: auth.user.id,
      });
      return NextResponse.json(createdBoard);
    } catch (error) {
      console.error("[api] board creation failed:", error);
      return NextResponse.json(
        { error: "Unable to create board" },
        { status: 500 }
      );
    }
  }
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
