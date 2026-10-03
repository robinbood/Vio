"use server";

import { and, eq, ne } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth/current-user";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { accountSettingsSchema } from "@/lib/validation/account";

export async function checkUsernameAvailability(username: string): Promise<boolean> {
  const currentUser = await getCurrentUser();
  if (!currentUser) return false;
  const parsed = accountSettingsSchema.shape.username.safeParse(username);
  if (!parsed.success) return false;

  try {
    const [existingUser] = await db
      .select({ id: user.id })
      .from(user)
      .where(
        and(
          eq(user.username, parsed.data),
          ne(user.id, currentUser.id)
        )
      )
      .limit(1);

    return !existingUser;
  } catch (error) {
    console.error("[account] username availability check failed:", error);
    throw new Error("Unable to check username availability.");
  }
}
