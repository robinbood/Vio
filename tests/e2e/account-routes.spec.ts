import { execFileSync } from "node:child_process";
import { expect, test } from "@playwright/test";

const base = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

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

test("account, cards, activity, and workspace settings routes work", async ({
  page,
}) => {
  test.setTimeout(90_000);
  const email = `routes-${Date.now()}@example.com`;

  await page.goto(`${base}/login`);
  const signup = await page.evaluate(
    async ({ base, email }) => {
      const response = await fetch(`${base}/api/auth/sign-up/email`, {
        method: "POST",
        headers: { "content-type": "application/json", origin: base },
        body: JSON.stringify({
          email,
          password: "correct-horse-battery",
          name: "Route Test",
        }),
      });
      return response.status;
    },
    { base, email }
  );
  expect(signup).toBe(200);

  const token = mintVerificationToken(email);
  await page.goto(`/verify-email?token=${token}`);
  await expect(page).toHaveURL(/\/boards$/);

  await page.goto("/cards");
  await expect(
    page.getByRole("heading", { name: "Cards", exact: true })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "No cards assigned to you" })
  ).toBeVisible();

  const username = `route-${Date.now()}`;
  await page.goto("/settings");
  await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
  await page.getByLabel("Username").fill(username);
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByRole("status")).toHaveText(
    "Your account settings were saved."
  );

  await page.goto(`/u/${username}/activity`);
  await expect(
    page.getByRole("heading", { name: "Activity", exact: true })
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "No activity yet" })).toBeVisible();

  await page.goto("/workspaces/new");
  await page.getByLabel("Workspace name").fill(`Route QA ${Date.now()}`);
  await page.getByRole("button", { name: "Create workspace" }).click();
  await expect(page).toHaveURL(/\/workspaces\/[a-f0-9]{24}$/, {
    timeout: 30_000,
  });

  const workspacePath = new URL(page.url()).pathname;
  await page.goto(`${workspacePath}/settings`);
  await expect(
    page.getByRole("heading", { name: "Workspace settings" })
  ).toBeVisible();
  await page.getByLabel("Workspace name").fill("Route QA Updated");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByRole("status")).toHaveText("Workspace settings saved.");

  await page.goto(workspacePath);
  await expect(
    page.getByRole("heading", { name: "Route QA Updated" })
  ).toBeVisible();
});
