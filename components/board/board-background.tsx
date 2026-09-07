import { cn } from "@/lib/utils/cn";
import { BOARD_BACKGROUNDS, type BoardBg } from "@/lib/utils/trello-colors";

type BoardBackgroundProps = {
  background: BoardBg;
  className?: string;
  children?: React.ReactNode;
};

export function BoardBackground({
  background,
  className,
  children,
}: BoardBackgroundProps) {
  const style: React.CSSProperties =
    background.type === "color"
      ? { background: background.value }
      : { background: background.value };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border bg-cover bg-center",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}

export { BOARD_BACKGROUNDS, type BoardBg };