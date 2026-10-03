/**
 * Every destination the UI is allowed to link to.
 *
 * This exists because the sidebar, user menu and board header previously each
 * hard-coded hrefs, several of which had no matching route — so the primary
 * "Create" button and most of the nav 404'd. Adding an entry here without
 * adding the route reintroduces the bug; adding the route without an entry just
 * makes it unreachable, which is safe.
 */
export const ROUTES = {
  boards: "/boards",
  newBoard: "/boards/new",
  workspaces: "/workspaces",
  newWorkspace: "/workspaces/new",
  notifications: "/notifications",
  help: "/help",
  memberDirectory: "/members",
  powerUpDirectory: "/power-ups",
  templates: "/templates",
  billing: "/billing",
  settings: "/settings",
} as const;

export type RouteKey = keyof typeof ROUTES;

export const boardHref = (boardId: string): string => `${ROUTES.boards}/${boardId}`;
export const boardNewHref = (listId?: string): string =>
  listId ? `${ROUTES.newBoard}/${listId}` : ROUTES.newBoard;
export const workspaceHref = (id: string): string => `${ROUTES.workspaces}/${id}`;
export const workspaceMembersHref = (id: string): string =>
  `${ROUTES.workspaces}/${id}/members`;
export const workspaceSettingsHref = (id: string): string =>
  `${ROUTES.workspaces}/${id}/settings`;
export const profileHref = (username: string): string => `/u/${username}`;
export const starredBoardsHref = (): string => `${ROUTES.boards}?starred=1`;

/** Board URL slug route, as AGENTS.md §1 specifies. */
export const boardBySlugHref = (workspaceSlug: string, boardSlug: string): string =>
  `/b/${workspaceSlug}/${boardSlug}`;
