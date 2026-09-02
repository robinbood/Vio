import { cn } from "@/lib/utils/cn";

export function VioLogo({ className }: { className?: string }) {
  return (
    <svg
      className={cn("text-current", className)}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Vio"
    >
      <defs>
        <linearGradient id="vioGradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#4338ca" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="7" fill="url(#vioGradient)" />
      {/* Two stacked boards/cards forming a V */}
      <path
        d="M7 9.5C7 8.67 7.67 8 8.5 8H11C11.55 8 12 8.45 12 9V22.5C12 23.33 11.33 24 10.5 24H8.5C7.67 24 7 23.33 7 22.5V9.5Z"
        fill="white"
        fillOpacity="0.95"
      />
      <path
        d="M14 12.5C14 11.67 14.67 11 15.5 11H18C18.55 11 19 11.45 19 12V22.5C19 23.33 18.33 24 17.5 24H15.5C14.67 24 14 23.33 14 22.5V12.5Z"
        fill="white"
        fillOpacity="0.7"
      />
      {/* Forward chevron in the V */}
      <path
        d="M21 14L25 17L21 20V14Z"
        fill="white"
      />
    </svg>
  );
}
