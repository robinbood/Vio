import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { NewBoardForm } from "@/components/board/new-board-form";

vi.mock("@/app/actions/board", () => ({
  createBoardAction: vi.fn(),
}));

describe("new board workspace selector", () => {
  it("uses a placeholder for no workspace instead of an invalid empty option", () => {
    render(
      <NewBoardForm
        workspaces={[
          { id: "workspace-1", name: "Product team" },
        ]}
      />
    );

    expect(
      screen.getByRole("combobox", { name: "Workspace" })
    ).toHaveTextContent("No workspace");
  });

  it("does not show a workspace selector when the user has no workspaces", () => {
    render(<NewBoardForm workspaces={[]} />);

    expect(
      screen.queryByRole("combobox", { name: "Workspace" })
    ).not.toBeInTheDocument();
  });
});
