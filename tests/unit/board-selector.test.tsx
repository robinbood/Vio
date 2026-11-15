import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import BoardsHome from "@/app/(app)/boards/page";
import { getCurrentUser } from "@/lib/auth/current-user";
import { listStarredBoards, listUserBoards } from "@/lib/data/boards";

vi.mock("@/lib/auth/current-user", () => ({ getCurrentUser: vi.fn() }));
vi.mock("@/lib/data/boards", () => ({
  listStarredBoards: vi.fn(),
  listUserBoards: vi.fn(),
}));

const boardRows = [
  {
    id: "board-open",
    name: "Roadmap",
    description: "Product planning",
    backgroundColor: "#123456",
    backgroundImage: null,
    isClosed: false,
    isTemplate: false,
  },
  {
    id: "board-archived",
    name: "Archived board",
    description: null,
    backgroundColor: null,
    backgroundImage: null,
    isClosed: true,
    isTemplate: false,
  },
  {
    id: "board-template",
    name: "Template board",
    description: null,
    backgroundColor: null,
    backgroundImage: null,
    isClosed: false,
    isTemplate: true,
  },
] as Awaited<ReturnType<typeof listUserBoards>>;

beforeEach(() => {
  vi.mocked(getCurrentUser).mockResolvedValue({
    id: "user-1",
    name: "Ada Lovelace",
    email: "ada@example.com",
    username: "ada",
    initials: "AL",
    avatarColor: "#6d28d9",
  });
  vi.mocked(listUserBoards).mockResolvedValue(boardRows);
  vi.mocked(listStarredBoards).mockResolvedValue([
    {
      id: "board-open",
      name: "Roadmap",
      backgroundColor: "#123456",
      backgroundImage: null,
      isClosed: false,
    },
    {
      id: "board-archived",
      name: "Archived board",
      backgroundColor: null,
      backgroundImage: null,
      isClosed: true,
    },
  ]);
});

describe("board selector", () => {
  it("shows links to real open boards instead of placeholder tiles", async () => {
    render(
      await BoardsHome({ searchParams: Promise.resolve({}) })
    );

    expect(
      screen
        .getAllByRole("link", { name: "Roadmap" })
        .some((link) => link.getAttribute("href") === "/boards/board-open")
    ).toBe(true);
    expect(screen.queryByText("Create a new board")).not.toBeInTheDocument();
    expect(screen.queryByText("Archived board")).not.toBeInTheDocument();
    expect(screen.queryByText("Template board")).not.toBeInTheDocument();
  });

  it("honors the starred-board filter and excludes archived boards", async () => {
    render(
      await BoardsHome({
        searchParams: Promise.resolve({ starred: "1" }),
      })
    );

    expect(
      screen.getByRole("heading", { name: "Starred boards" })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Roadmap" })).toBeInTheDocument();
    expect(screen.queryByText("Archived board")).not.toBeInTheDocument();
  });
});
