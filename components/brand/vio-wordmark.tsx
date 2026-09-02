import { cn } from "@/lib/utils/cn";

export function VioWordmark({
  className,
  gradient = false,
}: {
  className?: string;
  gradient?: boolean;
}) {
  return (
    <span
      className={cn(
        "font-semibold tracking-tight",
        gradient &&
          "bg-gradient-to-r from-pink-500 via-violet-500 to-indigo-500 bg-clip-text text-transparent",
        className
      )}
    >
      Vio
    </span>
  );
}
