import "server-only";

import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { apiToken, user } from "@/lib/db/schema";
import { hashToken } from "@/lib/utils/api-token";

export type ApiAuth =
  | { kind: "session"; user: { id: string; email: string; name: string } }
  | {
      kind: "token";
      user: { id: string; email: string; name: string };
      tokenHint: string;
    };

/**
 * Authenticate against a Better Auth session or an API token.
 * Basic credentials use Trello's `apiKey:token` format; Bearer uses the token.
 */
export async function requireApiAuth(hdrs: Headers): Promise<ApiAuth | null> {
  if (hdrs.has("cookie")) {
    const session = await auth.api.getSession({ headers: hdrs });
    if (session?.user?.id) {
      return {
        kind: "session",
        user: {
          id: session.user.id,
          email: session.user.email ?? "",
          name: session.user.name ?? "",
        },
      };
    }
  }

  const authorization = hdrs.get("authorization") ?? "";
  let apiKeyHash: string | undefined;
  let token: string;

  if (authorization.startsWith("Bearer ")) {
    token = authorization.slice("Bearer ".length).trim();
  } else if (authorization.startsWith("Basic ")) {
    const credentials = Buffer.from(
      authorization.slice("Basic ".length).trim(),
      "base64"
    ).toString("utf8");
    const separator = credentials.indexOf(":");
    if (separator < 1) return null;
    apiKeyHash = hashToken(credentials.slice(0, separator));
    token = credentials.slice(separator + 1);
  } else {
    return null;
  }

  if (token.length < 4) return null;
  const conditions = [eq(apiToken.tokenHash, hashToken(token))];
  if (apiKeyHash) conditions.push(eq(apiToken.apiKeyHash, apiKeyHash));

  const [row] = await db
    .select({
      userId: apiToken.userId,
      tokenHint: apiToken.tokenHint,
      email: user.email,
      name: user.name,
    })
    .from(apiToken)
    .innerJoin(user, eq(user.id, apiToken.userId))
    .where(and(...conditions))
    .limit(1);

  if (!row) return null;
  return {
    kind: "token",
    user: { id: row.userId, email: row.email, name: row.name },
    tokenHint: row.tokenHint ?? "",
  };
}
