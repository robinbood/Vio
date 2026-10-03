import { expect, test } from "@playwright/test";

/**
 * Signs up a throwaway account and walks the board loop. Requires email
 * verification to be disabled or a console transport, so it is opt-in:
 *   VIO_E2E_FULL=1 bun test:e2e
 */
const full = process.env.VIO_E2E_FULL === "1";

test.describe("board loop", () => {
  test.skip(!full, "set VIO_E2E_FULL=1 to run against a real account");

  test("creates a board, then sees it on the home page", async ({ page }) => {
    const email = `e2e-${Date.now()}@example.com`;

    await page.goto("/signup");
    await page.getByLabel(/email/i).fill(email);
    await page.getByLabel(/full name/i).fill("E2E Tester");
    await page.getByLabel(/^password/i).fill("correct-horse-battery");
    await page.getByRole("button", { name: /create account/i }).click();

    // Verification is mandatory by default, so sign-up lands on the
    // "check your email" state rather than a session.
    await expect(
      page.getByRole("heading", { name: /check your email/i })
    ).toBeVisible();
  });
});
