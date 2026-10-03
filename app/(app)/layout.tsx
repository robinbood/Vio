import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { VioLogo } from "@/components/brand/vio-logo";
import { GlobalSearch } from "@/components/global-search";
import { NotificationsBell } from "@/components/notifications-bell";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/user-nav";
import { AppSidebar } from "@/components/app/app-sidebar";
import { MobileNavToggle } from "@/components/app/mobile-nav";
import { Button } from "@/components/ui/button";
import { listSidebarWorkspaces } from "@/lib/data/workspaces";
import { Plus } from "lucide-react";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const workspaces = await listSidebarWorkspaces(user.id);

  return (
    <div className="grid min-h-screen grid-cols-1 grid-rows-[56px_1fr] bg-muted/30 md:grid-cols-[260px_minmax(0,1fr)]">
      {/* Top-left brand cell */}
      <header className="col-start-1 row-start-1 hidden h-14 items-center gap-2 border-b bg-background px-4 md:flex">
        <Link href="/boards" aria-label="Home" className="text-xl">
          <VioLogo withWordmark />
        </Link>
      </header>

      {/* Top bar */}
      <header className="col-start-1 row-start-1 flex h-14 min-w-0 items-center gap-3 border-b bg-background px-3 md:col-start-2 md:px-4">
        <MobileNavToggle workspaces={workspaces} />
        <Link href="/boards" aria-label="Home" className="text-lg md:hidden">
          <VioLogo />
        </Link>
        <GlobalSearch
          className="hidden min-w-0 flex-1 sm:flex"
          placeholder="Search boards, cards, members…"
        />
        <div className="flex items-center gap-1">
          <Button asChild variant="vio" size="sm" className="gap-1.5">
            <Link href="/boards/new">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Create</span>
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
      <aside className="col-start-1 row-start-2 hidden overflow-y-auto border-r bg-background md:block">
        <AppSidebar workspaces={workspaces} />
      </aside>

      {/* Main content */}
      <main
        id="main"
        tabIndex={-1}
        className="col-start-1 row-start-2 min-w-0 overflow-y-auto md:col-start-2"
      >
        {children}
      </main>
    </div>
  );
}
