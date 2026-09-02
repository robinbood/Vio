import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth/server";
import { signOut } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { VioLogo } from "@/components/brand/vio-logo";
import { BRAND } from "@/lib/brand";
import { LogOut } from "lucide-react";

export default async function BoardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  if (!session) redirect("/login");

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-14 items-center justify-between border-b bg-background px-4">
        <div className="flex items-center gap-2 font-semibold">
          <VioLogo className="h-6 w-6 text-vio" />
          {BRAND.name}
        </div>
        <form action={signOut}>
          <Button variant="ghost" size="sm" type="submit">
            <LogOut className="h-4 w-4" />
            Log out
          </Button>
        </form>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
