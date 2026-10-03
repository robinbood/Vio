import { test, expect } from "@playwright/test";
import { execFileSync } from "node:child_process";

/**
 * Full email-verification round trip against a real running server.
 * Requires a server whose origin matches BETTER_AUTH_URL, because better-auth
 * rejects cross-origin credentialed POSTs.
 */
const base = process.env.VERIFY_BASE_URL ?? "http://localhost:3333";

function mintToken(email: string): string {
  return execFileSync(
    "node",
    ["tests/helpers/mint-verification-token.mjs", email],
    { encoding: "utf8" }
  )
    .trim()
    .split("\n")
    .pop()!;
}

async function createAccount(
  page: import("@playwright/test").Page,
  email: string
) {
  // The fetch below runs in page context, so the page needs a real origin
  // first — `about:blank` would reject it.
  await page.goto(`${base}/login`);
  return page.evaluate(
    async ({ base, email }) => {
      const res = await fetch(`${base}/api/auth/sign-up/email`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          origin: base,
        },
        body: JSON.stringify({
          email,
          password: "correct-horse-battery",
          name: "Verify Flow",
        }),
      });
      return { status: res.status, body: await res.text() };
    },
    { base, email }
  );
}

test("verification grants a working session", async ({ page }) => {
  const email = `verify-${Date.now()}@example.com`;

  const signup = await createAccount(page, email);
  console.log("signup:", signup.status);
  expect(signup.status).toBe(200);

  // Before verifying: no session.
  await page.goto(`${base}/boards`);
  console.log("unverified /boards ->", page.url());

  const token = mintToken(email);
  await page.goto(`${base}/verify-email?token=${token}&callbackURL=%2Fboards`);

  // The client should verify, then navigate to the callback target.
  await page.waitForURL(/\/boards$/, { timeout: 20_000 });
  console.log("after verify url:", page.url());

  await expect(
    page.getByRole("heading", { name: /welcome/i })
  ).toBeVisible({ timeout: 20_000 });
});

test("an expired or bogus token shows an explanatory page", async ({ page }) => {
  await page.goto(`${base}/verify-email?token=not-a-real-token`);
  await expect(
    page.getByRole("heading", { name: /invalid or has expired/i })
  ).toBeVisible();
});

test("a link with no token is reported, not crashed on", async ({ page }) => {
  await page.goto(`${base}/verify-email`);
  await expect(
    page.getByRole("heading", { name: /missing a token/i })
  ).toBeVisible();
});
