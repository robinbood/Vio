import "dotenv/config";
import { SignJWT } from "jose";

/**
 * Mint an email-verification token for an address so the verification flow can
 * be tested without delivering real mail.
 *
 * Replicates better-auth's `createEmailVerificationToken`, which is a plain
 * HS256 JWT over `{ email }` with a one-hour expiry. Implemented against `jose`
 * directly because better-auth's package exports do not expose its internal
 * signing module.
 *
 * Usage: node tests/helpers/mint-verification-token.mjs user@example.com
 */
const secret =
  process.env.BETTER_AUTH_SECRET ?? process.env.AUTH_SECRET ?? undefined;

if (!secret) {
  console.error("BETTER_AUTH_SECRET is not set");
  process.exit(1);
}

const email = process.argv[2];
if (!email) {
  console.error("usage: node mint-verification-token.mjs <email>");
  process.exit(1);
}

const token = await new SignJWT({ email: email.toLowerCase() })
  .setProtectedHeader({ alg: "HS256" })
  .setIssuedAt()
  .setExpirationTime(Math.floor(Date.now() / 1000) + 3600)
  .sign(new TextEncoder().encode(secret));

console.log(token);
