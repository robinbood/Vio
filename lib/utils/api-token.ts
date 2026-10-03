import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

/**
 * API tokens and keys are stored as SHA-256 digests, so a database dump cannot
 * be replayed against the API. Tokens are high-entropy random strings, so a
 * plain digest is sufficient — there is nothing to brute-force, unlike a
 * user-chosen password which would need a memory-hard KDF.
 */
export function generateApiToken(): { token: string; hash: string } {
  const token = randomBytes(32).toString("base64url");
  return { token, hash: hashToken(token) };
}

export function generateApiKey(): { apiKey: string; hash: string } {
  const apiKey = randomBytes(16).toString("hex");
  return { apiKey, hash: hashToken(apiKey) };
}

export function hashToken(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

/** Constant-time digest comparison, to avoid leaking matches via timing. */
export function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/** Last four characters, so a user can identify a token without storing it. */
export function tokenHint(token: string): string {
  return token.slice(-4);
}
