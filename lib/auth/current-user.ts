import "server-only";
import { eq } from "drizzle-orm";
import { cache } from "react";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { getServerSession } from "@/lib/auth/server";
import { initialsFromName } from "@/lib/utils/ids";

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  username: string | null;
  initials: string;
  avatarColor: string | null;
};

/**
 * Returns the current user (from better-auth session + DB row) or null.
 * React `cache()` de-dupes the lookup per request so layouts and pages
 * share the same result.
 */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const session = await getServerSession();
  if (!session?.user?.id) return null;
  const rows = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      fullName: user.fullName,
      initials: user.initials,
      avatarColor: user.avatarColor,
    })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);
  const row = rows[0];
  if (!row) return null;
  const display = row.fullName ?? row.name;
  return {
    id: row.id,
    name: display,
    email: row.email,
    username: row.username,
    initials: row.initials ?? initialsFromName(display),
    avatarColor: row.avatarColor ?? "#6d28d9",
  };
});
