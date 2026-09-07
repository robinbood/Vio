"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Layout,
  Users,
  Zap,
  Star,
  Clock,
  BookOpen,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const HOME_LINKS = [
  { href: "/boards", label: "Home", icon: Home, exact: true },
  { href: "/workspaces", label: "Workspaces", icon: Building2, exact: true },
  { href: "/notifications", label: "Notifications", icon: Clock, exact: false },
];

const WORKSPACE_HEADERS: { id: string; name: string; boards: number }[] = [];

const DISCOVERY = [
  { href: "/templates", label: "Templates", icon: BookOpen },
  { href: "/members", label: "Member directory", icon: Users },
  { href: "/power-ups", label: "Power-Ups directory", icon: Zap },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex h-full flex-col gap-4 p-3 text-sm">
      {/* Home */}
      <div className="flex flex-col gap-0.5">
        {HOME_LINKS.map((l) => {
          const active = l.exact
            ? pathname === l.href
            : pathname === l.href || pathname?.startsWith(`${l.href}/`);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "flex items-center gap-2 rounded-md px-2 py-1.5 text-muted-foreground hover:bg-muted hover:text-foreground",
                active && "bg-muted text-foreground"
              )}
            >
              <l.icon className="h-4 w-4" />
              {l.label}
            </Link>
          );
        })}
        <Link
          href="/boards?starred=1"
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Star className="h-4 w-4" /> Starred boards
        </Link>
      </div>

      <Separator />

      {/* Workspaces */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <span>Workspaces</span>
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="h-5 w-5"
            aria-label="Create workspace"
          >
            <Link href="/workspaces/new">
              <Plus className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
        {WORKSPACE_HEADERS.map((ws) => (
          <div key={ws.id} className="flex flex-col gap-0.5">
            <button
              type="button"
              className="flex items-center gap-2 rounded-md px-2 py-1.5 font-medium text-foreground hover:bg-muted"
            >
              <Building2 className="h-4 w-4 text-muted-foreground" />
              {ws.name}
            </button>
            <Link
              href={`/workspaces/${ws.id}/boards`}
              className="ml-6 flex items-center gap-2 rounded-md px-2 py-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Layout className="h-3.5 w-3.5" />
              Boards
              <span className="ml-auto text-xs text-muted-foreground">
                {ws.boards}
              </span>
            </Link>
            <Link
              href={`/workspaces/${ws.id}/members`}
              className="ml-6 flex items-center gap-2 rounded-md px-2 py-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Users className="h-3.5 w-3.5" />
              Members
            </Link>
          </div>
        ))}
      </div>

      <Separator />

      {/* Discovery */}
      <div className="flex flex-col gap-0.5">
        {DISCOVERY.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "flex items-center gap-2 rounded-md px-2 py-1.5 text-muted-foreground hover:bg-muted hover:text-foreground",
                active && "bg-muted text-foreground"
              )}
            >
              <l.icon className="h-4 w-4" />
              {l.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function Plus({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
