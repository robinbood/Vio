import { cn } from "@/lib/utils/cn";

type VioLogoProps = {
  className?: string;
  /** "default" = full color gradient. "mono" = currentColor for use on colored backgrounds. */
  variant?: "default" | "mono";
  /** Whether to render the wordmark alongside the mark. */
  withWordmark?: boolean;
};

export function VioLogo({
  className,
  variant = "default",
  withWordmark = false,
}: VioLogoProps) {
  const gradId = variant === "default" ? "vio-logo-gradient" : "vio-logo-gradient-mono";

  return (
    <span
      className={cn("inline-flex items-center gap-2 leading-none", className)}
    >
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Vio"
        className="shrink-0"
        style={{ height: "1em", width: "1em" }}
      >
        <defs>
          <linearGradient
            id="vio-logo-gradient"
            x1="4"
            y1="6"
            x2="36"
            y2="34"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#ec4899" />
            <stop offset="0.45" stopColor="#8b5cf6" />
            <stop offset="1" stopColor="#6366f1" />
          </linearGradient>
          <linearGradient
            id="vio-logo-gradient-mono"
            x1="4"
            y1="6"
            x2="36"
            y2="34"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="currentColor" />
            <stop offset="1" stopColor="currentColor" />
          </linearGradient>
        </defs>
        {/* Soft rounded square backdrop */}
        <rect width="40" height="40" rx="10" fill={`url(#${gradId})`} />
        {/* The "V" — two rounded chevrons, top-aligned, with a notch */}
        <path
          d="M11.5 13.5 L20 27 L28.5 13.5"
          stroke="white"
          strokeWidth="3.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* The spark — a small 4-point star sitting in the V's valley */}
        <path
          d="M20 30.5 L20.85 32.15 L22.5 33 L20.85 33.85 L20 35.5 L19.15 33.85 L17.5 33 L19.15 32.15 Z"
          fill="white"
        />
        {/* Tiny cyan accent dot above the spark for vibrancy */}
        {variant === "default" && (
          <circle cx="29.5" cy="11" r="1.5" fill="#22d3ee" />
        )}
      </svg>
      {withWordmark && (
        <span className="font-semibold tracking-tight">Vio</span>
      )}
    </span>
  );
}
