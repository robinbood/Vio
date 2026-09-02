export const BRAND = {
  name: "Vio",
  tagline: "Move work forward.",
  description:
    "Vio is a boards-and-cards workspace that helps teams plan, ship, and celebrate together.",
  domain: "vio.app",
  copyright: "Vio",
  cookiePrefix: "vio",
  auth: {
    appName: "Vio",
    twoFactorIssuer: "Vio",
  },
} as const;

export const BRAND_COLORS = {
  primary: "#6d28d9", // vio-600
  primaryHover: "#5b21b6", // vio-700
  primaryAccent: "#a78bfa", // vio-400
  // Vibrant brand spectrum used in the logo + hero gradient
  magenta: "#ec4899",
  violet: "#8b5cf6",
  indigo: "#6366f1",
  cyan: "#22d3ee",
} as const;

/** Tailwind classes for the brand gradient — useful for headlines, panels, buttons. */
export const BRAND_GRADIENT =
  "bg-gradient-to-r from-pink-500 via-violet-500 to-indigo-500";
export const BRAND_GRADIENT_TEXT =
  "bg-gradient-to-r from-pink-500 via-violet-500 to-indigo-500 bg-clip-text text-transparent";
