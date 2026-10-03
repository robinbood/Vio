export type SsoProviderId = "google" | "microsoft" | "apple" | "slack";

export type SsoProvider = {
  id: SsoProviderId;
  label: string;
  iconUrl: string;
};

/**
 * Icon metadata for the SSO buttons. Which providers are *enabled* is decided
 * on the server in `lib/auth/index.ts` and passed down as a prop: a client
 * component cannot read these, because Next only inlines statically analysable
 * `process.env.NEXT_PUBLIC_FOO` member expressions, never `process.env[key]`.
 */
export const SSO_PROVIDER_META: Record<SsoProviderId, Omit<SsoProvider, "id">> = {
  google: {
    label: "Google",
    iconUrl:
      "https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg",
  },
  microsoft: {
    label: "Microsoft",
    iconUrl:
      "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
  },
  apple: {
    label: "Apple",
    iconUrl:
      "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
  },
  slack: {
    label: "Slack",
    iconUrl:
      "https://a.slack-edge.com/80588/marketing/img/meta/slack_hash_256.png",
  },
};

/** Env var that must be present for each provider to be usable. */
export const SSO_PROVIDER_ENV: Record<SsoProviderId, string> = {
  google: "GOOGLE_CLIENT_ID",
  microsoft: "MICROSOFT_CLIENT_ID",
  apple: "APPLE_CLIENT_ID",
  slack: "SLACK_CLIENT_ID",
};
