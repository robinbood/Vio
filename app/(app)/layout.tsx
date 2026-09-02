import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { VioLogo } from "@/components/brand/vio-logo";
import { GlobalSearch } from "@/components/global-search";
import { NotificationsBell } from "@/components/notifications-bell";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/user-nav";
import { AppSidebar } from "@/components/app/app-sidebar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="grid min-h-screen grid-cols-[260px_1fr] grid-rows-[56px_1fr] bg-muted/30">
      {/* Top-left brand cell */}
      <header className="col-start-1 row-start-1 flex h-14 items-center gap-2 border-b bg-background px-4">
        <Link href="/boards" aria-label="Home" className="text-xl">
          <VioLogo withWordmark />
        </Link>
      </header>

      {/* Top bar */}
      <header className="col-start-2 row-start-1 flex h-14 items-center gap-3 border-b bg-background px-4">
        <GlobalSearch className="flex-1" placeholder="Search boards, cards, members…" />
        <div className="flex items-center gap-1">
          <Button asChild variant="vio" size="sm" className="gap-1.5">
            <Link href="/boards/new">
              <Plus className="h-4 w-4" /> Create
            </Link>
          </Button>
          <NotificationsBell />
          <ThemeToggle />
          <UserNav
            name={user.name}
            email={user.email}
            initials={user.initials}
            avatarColor={user.avatarColor}
            username={user.username}
          />
        </div>
      </header>

      {/* Left rail */}
      <aside className="col-start-1 row-start-2 overflow-y-auto border-r bg-background">
        <AppSidebar />
      </aside>

      {/* Main content */}
      <main className="col-start-2 row-start-2 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
