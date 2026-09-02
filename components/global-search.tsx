"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function GlobalSearch({
  className,
  placeholder = "Search…",
}: {
  className?: string;
  placeholder?: string;
}) {
  const [value, setValue] = React.useState("");

  return (
    <form
      role="search"
      onSubmit={(e) => e.preventDefault()}
      className={cn(
        "flex h-8 w-full max-w-sm items-center gap-2 rounded-md border bg-muted/40 px-3 text-sm",
        "focus-within:border-ring focus-within:bg-background focus-within:ring-2 focus-within:ring-ring/30",
        className
      )}
    >
      <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="h-full w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
      <kbd className="hidden rounded border bg-background px-1.5 font-mono text-[10px] text-muted-foreground sm:inline-block">
        /
      </kbd>
    </form>
  );
}
