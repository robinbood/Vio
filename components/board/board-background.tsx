import { cn } from "@/lib/utils/cn";
import { BOARD_BACKGROUNDS, type BoardBg } from "@/lib/utils/trello-colors";

type BoardBackgroundProps = {
  background: BoardBg;
  className?: string;
  children?: React.ReactNode;
};

type BoardBackgroundColors = {
  backgroundColor: string | null;
  backgroundImage: string | null;
};

export function boardBackgroundStyle({
  backgroundColor,
  backgroundImage,
}: BoardBackgroundColors): React.CSSProperties {
  if (backgroundImage) {
    const escapedImage = backgroundImage
      .replaceAll("\\", "\\\\")
      .replaceAll('"', '\\"')
      .replace(/[\r\n\f]/g, "");

    return {
      backgroundColor: backgroundColor ?? "#0079bf",
      backgroundImage: `url("${escapedImage}")`,
      backgroundPosition: "center",
      backgroundSize: "cover",
    };
  }

  return { background: backgroundColor ?? "#0079bf" };
}

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