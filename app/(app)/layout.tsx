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
import { getUnreadNotificationCount } from "@/lib/data/notifications";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const workspaces = await listSidebarWorkspaces(user.id);
  const unreadNotificationCount = await getUnreadNotificationCount(user.id);

  return (
    <div className="grid min-h-screen grid-cols-1 grid-rows-[56px_1fr] bg-muted/30 md:grid-cols-[260px_minmax(0,1fr)]">
      {/* Top-left brand cell */}
      <header className="col-start-1 row-start-1 hidden h-14 items-center border-b border-r bg-background px-5 md:flex">
        <Link href="/boards" aria-label="Home" className="text-2xl">
          <VioLogo withWordmark />
        </Link>
      </header>

      {/* Top bar */}
      <header className="col-start-1 row-start-1 flex h-14 min-w-0 items-center gap-3 border-b bg-background/95 px-3 shadow-sm backdrop-blur md:col-start-2 md:px-5">
        <MobileNavToggle workspaces={workspaces} />
        <Link href="/boards" aria-label="Home" className="text-lg md:hidden">
          <VioLogo withWordmark />
        </Link>
        <GlobalSearch
          className="hidden min-w-0 max-w-xl flex-1 sm:flex"
          placeholder="Search boards, cards, members…"
        />
        <div className="ml-auto flex shrink-0 items-center gap-1 border-l pl-2 sm:gap-1.5 sm:pl-3">
          <Button asChild variant="vio" className="h-9 gap-1.5 px-3">
            <Link href="/boards/new">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Create</span>
            </Link>
          </Button>
          <NotificationsBell initialCount={unreadNotificationCount} />
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
