import { execFileSync } from "node:child_process";
import { expect, test } from "@playwright/test";

const base = "http://localhost:3000";

function mintVerificationToken(email: string): string {
  return execFileSync(
    "node",
    ["tests/helpers/mint-verification-token.mjs", email],
    { encoding: "utf8" }
  )
    .trim()
    .split("\n")
    .pop()!;
}

test("reloading an authenticated board does not start a document loop", async ({
  page,
}) => {
  test.setTimeout(60_000);
  const email = `reload-${Date.now()}@example.com`;

  await page.goto(`${base}/login`);
  const signup = await page.evaluate(
    async ({ base, email }) => {
      const response = await fetch(`${base}/api/auth/sign-up/email`, {
        method: "POST",
        headers: { "content-type": "application/json", origin: base },
        body: JSON.stringify({
          email,
          password: "correct-horse-battery",
          name: "Reload Test",
        }),
      });
      return response.status;
    },
    { base, email }
  );
  expect(signup).toBe(200);

  const token = mintVerificationToken(email);
  await page.goto(`${base}/verify-email?token=${token}`);
  await expect(page.getByRole("heading", { name: /welcome/i })).toBeVisible({
    timeout: 20_000,
  });
  await expect(page).toHaveURL(/\/boards$/);

  const documentRequests: string[] = [];
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (url.origin === base && request.resourceType() === "document") {
      documentRequests.push(url.pathname);
    }
  });

  await page.reload({ waitUntil: "commit" });
  await page.waitForTimeout(5_000);
  await expect(page.getByRole("heading", { name: /welcome/i })).toBeVisible();
  expect(documentRequests.filter((pathname) => pathname === "/boards")).toHaveLength(
    1
  );
});
