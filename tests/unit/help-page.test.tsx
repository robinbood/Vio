import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HelpPage from "@/app/(app)/help/page";

/** AGENTS.md §15 requires a `?` cheat sheet listing the keyboard map. */
describe("keyboard shortcut cheat sheet", () => {
  it("renders the shortcuts as a description list", () => {
    render(<HelpPage />);

    expect(
      screen.getByRole("heading", { name: /keyboard shortcuts/i })
    ).toBeInTheDocument();
    expect(screen.getAllByRole("term").length).toBeGreaterThan(10);
  });

  it("documents the shortcuts Trello defines", () => {
    render(<HelpPage />);

    for (const label of [
      /open this cheat sheet/i,
      /focus search/i,
      /undo last action/i,
      /new list/i,
    ]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });
});
