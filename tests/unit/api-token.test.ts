import { describe, expect, it } from "vitest";
import {
  generateApiKey,
  generateApiToken,
  hashToken,
  safeCompare,
  tokenHint,
} from "@/lib/utils/api-token";

describe("api token hashing", () => {
  it("stores only a digest, never the token itself", () => {
    const { token, hash } = generateApiToken();
    expect(hash).toHaveLength(64);
    expect(hash).toBe(hashToken(token));
    expect(hash).not.toContain(token);
  });

  it("is deterministic so lookup can hash the presented token", () => {
    expect(hashToken("abc")).toBe(hashToken("abc"));
    expect(hashToken("abc")).not.toBe(hashToken("abd"));
  });

  it("generates high-entropy, URL-safe tokens", () => {
    const tokens = new Set(Array.from({ length: 50 }, () => generateApiToken().token));
    expect(tokens.size).toBe(50);
    for (const { token } of [generateApiToken(), generateApiToken()]) {
      expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
      expect(token.length).toBeGreaterThanOrEqual(43);
    }
  });

  it("compares digests in constant time without throwing on length mismatch", () => {
    expect(safeCompare("abc", "abc")).toBe(true);
    expect(safeCompare("abc", "abd")).toBe(false);
    expect(safeCompare("abc", "much-longer-value")).toBe(false);
  });

  it("exposes only the last four characters as a hint", () => {
    expect(tokenHint("abcdefgh1234")).toBe("1234");
    expect(generateApiKey().apiKey).toMatch(/^[0-9a-f]{32}$/);
  });
});
