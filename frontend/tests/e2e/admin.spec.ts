import { expect, test } from "@playwright/test";

test.describe("Admin Panel", () => {
  test("redirects unauthenticated user from /admin to /login", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe("Admin Panel (authenticated)", () => {
  test.use({
    storageState: {
      cookies: [
        {
          name: "next-auth.session-token",
          value: "mock-session-token-for-e2e",
          domain: "localhost",
          path: "/",
          httpOnly: true,
          secure: false,
          sameSite: "Lax" as const,
          expires: Math.floor(Date.now() / 1000) + 86400,
        },
      ],
      origins: [],
    },
  });

  test("admin page loads without redirect", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).not.toHaveURL(/\/login/);
  });

  test("admin page has a heading", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.getByRole("heading", { name: /admin|dashboard/i })).toBeVisible();
  });

  test("users subpage loads", async ({ page }) => {
    await page.goto("/admin/users");
    await expect(page).not.toHaveURL(/\/login/);
  });

  test("roles subpage loads", async ({ page }) => {
    await page.goto("/admin/roles");
    await expect(page).not.toHaveURL(/\/login/);
  });

  test("audit-logs subpage loads", async ({ page }) => {
    await page.goto("/admin/audit-logs");
    await expect(page).not.toHaveURL(/\/login/);
  });

  test("security subpage loads", async ({ page }) => {
    await page.goto("/admin/security");
    await expect(page).not.toHaveURL(/\/login/);
  });
});

