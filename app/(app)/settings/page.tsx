import { redirect } from "next/navigation";
import { AccountSettingsForm } from "@/components/account/account-settings-form";
import { getCurrentUser } from "@/lib/auth/current-user";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const metadata = {
  title: "Settings",
};

export default async function AccountSettingsPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login");

  const account = await db.query.user.findFirst({
    where: eq(user.id, currentUser.id),
    columns: {
      email: true,
      fullName: true,
      name: true,
      username: true,
      initials: true,
      bio: true,
      locale: true,
      timezone: true,
      avatarColor: true,
    },
  });
  if (!account) redirect("/login");

  return (
    <div className="mx-auto w-full max-w-3xl p-4 sm:p-8">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Settings</h1>
      <AccountSettingsForm
        email={account.email}
        fullName={account.fullName ?? account.name}
        username={account.username ?? ""}
        initials={account.initials}
        bio={account.bio}
        locale={account.locale}
        timezone={account.timezone}
        avatarColor={account.avatarColor}
      />
    </div>
  );
}
