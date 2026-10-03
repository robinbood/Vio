import { test, expect } from "@playwright/test";
import { execFileSync } from "node:child_process";

const base = "http://localhost:3000";

function mintToken(email: string): string {
  return execFileSync("node", ["tests/helpers/mint-verification-token.mjs", email], {
    encoding: "utf8",
  })
    .trim()
    .split("\n")
    .pop()!;
}

test.use({ browserName: "firefox" });

const ROUTES = ["/boards", "/workspaces", "/notifications", "/help", "/boards/new"];

test("which routes reload-loop in Firefox", async ({ page }) => {
  const email = `loop3-${Date.now()}@example.com`;

  await page.goto(`${base}/login`);
  await page.evaluate(
    async ({ base, email }) => {
      await fetch(`${base}/api/auth/sign-up/email`, {
        method: "POST",
        headers: { "content-type": "application/json", origin: base },
        body: JSON.stringify({
          email,
          password: "correct-horse-battery",
          name: "Loop Test",
        }),
      });
    },
    { base, email }
  );
  const token = mintToken(email);
  await page.goto(`${base}/verify-email?token=${token}`);
  await page.waitForURL(/\/boards$/, { timeout: 20_000 }).catch(() => {});

  for (const route of ROUTES) {
    let docs = 0;
    const listener = (r: import("@playwright/test").Request) => {
      const u = new URL(r.url());
      if (u.origin === base && r.resourceType() === "document") docs++;
    };
    page.on("request", listener);
    await page.goto(`${base}${route}`, { waitUntil: "commit" }).catch(() => {});
    await page.waitForTimeout(2500);
    page.off("request", listener);
    console.log(`ROUTE ${route.padEnd(16)} document requests in 2.5s: ${docs}`);
  }

  expect(true).toBe(true);
});
