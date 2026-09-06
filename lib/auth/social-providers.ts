export const ENABLED_SOCIAL_PROVIDERS = [
  {
    id: "google" as const,
    label: "Google",
    src: "https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg",
    enabled: typeof process !== "undefined" && !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  },
  {
    id: "microsoft" as const,
    label: "Microsoft",
    src: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    enabled: typeof process !== "undefined" && !!process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID,
  },
  {
    id: "apple" as const,
    label: "Apple",
    src: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    enabled: typeof process !== "undefined" && !!process.env.NEXT_PUBLIC_APPLE_CLIENT_ID,
  },
  {
    id: "slack" as const,
    label: "Slack",
    src: "https://a.slack-edge.com/80588/marketing/img/meta/slack_hash_256.png",
    enabled: typeof process !== "undefined" && !!process.env.NEXT_PUBLIC_SLACK_CLIENT_ID,
  },
] as const;

export type SocialProvider = (typeof ENABLED_SOCIAL_PROVIDERS)[number]["id"];
