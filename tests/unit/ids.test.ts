import { describe, expect, it } from "vitest";
import { initialsFromName, newId, slugify } from "@/lib/utils/ids";

describe("newId", () => {
  it("produces 24-character Mongo-style hex ids", () => {
    expect(newId()).toMatch(/^[0-9a-f]{24}$/);
  });

  it("does not collide across many calls", () => {
    const ids = new Set(Array.from({ length: 2000 }, () => newId()));
    expect(ids.size).toBe(2000);
  });
});

describe("slugify", () => {
  it("lowercases and hyphenates", () => {
    expect(slugify("Product Roadmap")).toBe("product-roadmap");
    expect(slugify("  Acme   Corp  ")).toBe("acme-corp");
  });

  it("strips characters that are unsafe in a url segment", () => {
    expect(slugify("Q1/Q2 Plan!")).toBe("q1q2-plan");
    expect(slugify("a<b>c")).toBe("abc");
  });

  it("caps at the column length", () => {
    expect(slugify("x".repeat(100))).toHaveLength(64);
  });

  it("returns an empty string for input with nothing slug-safe", () => {
    // Callers must fall back to the generated id.
    expect(slugify("!!!")).toBe("");
  });
});

describe("initialsFromName", () => {
  it("uses first and last name", () => {
    expect(initialsFromName("Ada Lovelace")).toBe("AL");
    expect(initialsFromName("Ada Byron King Lovelace")).toBe("AL");
  });

  it("handles single names and empty input", () => {
    expect(initialsFromName("Prince")).toBe("PR");
    expect(initialsFromName("")).toBe("??");
  });
});
