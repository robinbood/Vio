import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { twoFactor } from "better-auth/plugins/two-factor";
import { db } from "@/lib/db";
import { BRAND } from "@/lib/brand";
import * as schema from "@/lib/db/schema";

const secret =
  process.env.BETTER_AUTH_SECRET ??
  process.env.AUTH_SECRET ??
  "dev-secret-please-change-in-production-min-32-chars";

// Dynamic baseURL config for Vercel (supports production + preview URLs)
const baseURL = process.env.NODE_ENV === "production"
  ? {
      protocol: "https" as const,
      allowedHosts: ["*.vercel.app"],
      fallback: "https://vio-azure.vercel.app",
    }
  : process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL;

const trustedOrigins = ["https://vio-azure.vercel.app", "https://*.vercel.app"];

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
      username: { type: "string", required: false },
      fullName: { type: "string", required: false },
      initials: { type: "string", required: false },
      avatarColor: { type: "string", required: false },
      bio: { type: "string", required: false },
      locale: { type: "string", required: false },
      timezone: { type: "string", required: false },
      plan: { type: "string", required: false },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },
  advanced: {
    cookiePrefix: BRAND.cookiePrefix,
    trustedOrigins,
    trustedProxyHeaders: true,
  },
  plugins: [twoFactor(), nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
