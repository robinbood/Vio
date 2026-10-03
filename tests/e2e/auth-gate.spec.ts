import { expect, test } from "@playwright/test";

/**
 * Covers the auth gate that the proxy implements, which is the one piece of
 * routing logic unit tests cannot reach.
 */
test.describe("auth gate", () => {
  test("public pages are reachable without a session", async ({ page }) => {
    for (const path of [
      "/",
      "/login",
      "/signup",
      "/forgot-password",
      "/reset-password",
      "/two-factor",
      "/verify-email",
      "/privacy",
      "/robots.txt",
      "/sitemap.xml",
    ]) {
      const response = await page.goto(path);
      expect(response?.status(), `${path} should be public`).toBe(200);
    }
  });

  test("protected pages redirect to login and preserve the target", async ({
    page,
  }) => {
    for (const path of [
      "/boards",
      "/cards",
      "/settings",
      "/workspaces/missing/settings",
      "/u/alice/activity",
    ]) {
      await page.goto(path);
      expect(page.url(), `${path} should redirect to login`).toContain("/login");
      expect(page.url(), `${path} should preserve the target`).toContain(
        `redirect=${encodeURIComponent(path)}`
      );
    }
  });

  test("machine requests get a JSON 401 rather than a redirect", async ({
    request,
  }) => {
    const response = await request.get("/1/boards", { maxRedirects: 0 });
    expect(response.status()).toBe(401);
    expect(response.headers()["content-type"]).toContain("application/json");
    expect(await response.json()).toEqual({ error: "Unauthorized" });
  });

  test("sign-in page renders its form", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByLabel(/email or username/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /log in/i })).toBeVisible();
  });

  test("help lives behind the auth gate, since it is an app route", async ({
    page,
  }) => {
    await page.goto("/help");
    expect(page.url()).toContain("/login");
    expect(page.url()).toContain("redirect=%2Fhelp");
  });

  test("security headers are present", async ({ request }) => {
    const response = await request.get("/login");
    const headers = response.headers();
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["permissions-policy"]).toContain("camera=()");
  });
});
