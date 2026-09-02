"use client";

import Link from "next/link";
import { LogOut, User, Activity, CreditCard, Settings, HelpCircle, LayoutDashboard } from "lucide-react";
import { signOut } from "@/lib/auth/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
  name: string;
  email: string;
  initials: string;
  avatarColor?: string | null;
  username?: string | null;
};

export function UserNav({ name, email, initials, avatarColor, username }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-9 gap-2 rounded-full px-2"
          aria-label="Account menu"
        >
          <Avatar
            className="h-7 w-7"
            style={avatarColor ? { backgroundColor: avatarColor } : undefined}
          >
            <AvatarFallback
              className="text-xs font-semibold text-white"
              style={avatarColor ? { backgroundColor: avatarColor } : undefined}
            >
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-sm font-medium md:inline-block">
            {name}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="px-2 py-2">
          <div className="flex items-center gap-3">
            <Avatar
              className="h-10 w-10"
              style={avatarColor ? { backgroundColor: avatarColor } : undefined}
            >
              <AvatarFallback
                className="text-sm font-semibold text-white"
                style={avatarColor ? { backgroundColor: avatarColor } : undefined}
              >
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{name}</div>
              <div className="truncate text-xs text-muted-foreground">
                {email}
              </div>
            </div>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={username ? `/u/${username}` : "#"}>
            <User className="h-4 w-4" /> Profile and visibility
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={username ? `/u/${username}/activity` : "#"}>
            <Activity className="h-4 w-4" /> Activity
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/cards">
            <LayoutDashboard className="h-4 w-4" /> Cards
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <Settings className="h-4 w-4" /> Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/billing">
            <CreditCard className="h-4 w-4" /> Billing
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/help">
            <HelpCircle className="h-4 w-4" /> Help
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => signOut({ fetchOptions: { onSuccess: () => window.location.assign("/login") } })}
        >
          <LogOut className="h-4 w-4" /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
