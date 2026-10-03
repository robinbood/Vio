import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { twoFactor } from "better-auth/plugins/two-factor";
import { db } from "@/lib/db";
import { BRAND } from "@/lib/brand";
import * as schema from "@/lib/db/schema";

const isProduction = process.env.NODE_ENV === "production";
const configuredSecret =
  process.env.BETTER_AUTH_SECRET ?? process.env.AUTH_SECRET;
const secret = configuredSecret ?? "vio-local-development-secret-change-me";
const baseURL = process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL;
const isLocalBaseURL =
  baseURL?.startsWith("http://localhost:") ||
  baseURL?.startsWith("http://127.0.0.1:");

if (isProduction && (!configuredSecret || configuredSecret.length < 32)) {
  throw new Error(
    "BETTER_AUTH_SECRET must be configured with at least 32 characters in production"
  );
}

if (isProduction && (!baseURL || (!baseURL.startsWith("https://") && !isLocalBaseURL))) {
  throw new Error("BETTER_AUTH_URL must be an HTTPS URL in production");
}

const trustedOrigins = [
  baseURL,
  ...(process.env.BETTER_AUTH_TRUSTED_ORIGINS?.split(",") ?? []),
]
  .map((origin) => origin?.trim())
  .filter((origin): origin is string => Boolean(origin));

export const auth = betterAuth({
  appName: BRAND.auth.appName,
  baseURL,
  secret,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: process.env.NODE_ENV !== "production",
    minPasswordLength: 8,
    maxPasswordLength: 128,
    resetPasswordTokenExpiresIn: 60 * 30,
    revokeSessionsOnPasswordReset: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      enabled: !!process.env.GOOGLE_CLIENT_ID,
    },
    microsoft: {
      clientId: process.env.MICROSOFT_CLIENT_ID ?? "",
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET ?? "",
      enabled: !!process.env.MICROSOFT_CLIENT_ID,
    },
    apple: {
      clientId: process.env.APPLE_CLIENT_ID ?? "",
      clientSecret: process.env.APPLE_CLIENT_SECRET ?? "",
      enabled: !!process.env.APPLE_CLIENT_ID,
    },
    slack: {
      clientId: process.env.SLACK_CLIENT_ID ?? "",
      clientSecret: process.env.SLACK_CLIENT_SECRET ?? "",
      enabled: !!process.env.SLACK_CLIENT_ID,
    },
  },
  twoFactor: {
    issuer: BRAND.auth.twoFactorIssuer,
  },
  user: {
    additionalFields: {
      username: { type: "string", required: false, input: true },
      fullName: { type: "string", required: false, input: true },
      initials: { type: "string", required: false, input: true },
      avatarColor: { type: "string", required: false, input: true },
      bio: { type: "string", required: false, input: true },
      locale: { type: "string", required: false, input: true },
      timezone: { type: "string", required: false, input: true },
      plan: { type: "string", required: false, input: false },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
      strategy: "compact",
    },
  },
  rateLimit: {
    enabled: true,
    window: 10,
    max: 100,
    customRules: {
      "/api/auth/sign-in/email": { window: 60, max: 5 },
      "/api/auth/sign-up/email": { window: 60, max: 5 },
    },
  },
  trustedOrigins,
  advanced: {
    cookiePrefix: BRAND.cookiePrefix,
    useSecureCookies: isProduction,
    trustedProxyHeaders: false,
  },
  plugins: [twoFactor(), nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
