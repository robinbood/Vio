"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { VioLogo } from "@/components/brand/vio-logo";
import { BRAND } from "@/lib/brand";
import { AppSidebar, type SidebarWorkspace } from "@/components/app/app-sidebar";

/**
 * Off-canvas navigation for small screens. The rail is a fixed 260px column
 * above `md`, which left only ~115px of content width on a 375px viewport.
 */
export function MobileNavToggle({
  workspaces,
}: {
  workspaces: SidebarWorkspace[];
}) {
  const pathname = usePathname();
  // Store *which path* the drawer was opened on rather than a boolean. When
  // navigation changes the path the drawer closes on its own, so there is no
  // setState-in-effect to cause a cascading render.
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const open = openedAt === pathname;
  const setOpen = (next: boolean) => setOpenedAt(next ? pathname : null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, pathname]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
        aria-expanded={open}
        aria-controls="app-rail"
        className="-ml-1 inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-foreground/40"
          />
          <div
            id="app-rail"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col border-r bg-background shadow-xl"
          >
            <div className="flex h-14 items-center justify-between border-b px-4">
              <Link href="/boards" aria-label={`${BRAND.name} home`}>
                <VioLogo withWordmark />
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close navigation"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <AppSidebar workspaces={workspaces} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
