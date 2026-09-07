import { cn } from "@/lib/utils/cn";

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "secondary" | "outline" | "destructive";
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        variant === "default" &&
          "bg-primary text-primary-foreground",
        variant === "secondary" &&
          "bg-muted text-muted-foreground",
        variant === "outline" &&
          "border border-border text-foreground",
        variant === "destructive" &&
          "bg-destructive text-destructive-foreground",
        className
      )}
      {...props}
    />
  );
}