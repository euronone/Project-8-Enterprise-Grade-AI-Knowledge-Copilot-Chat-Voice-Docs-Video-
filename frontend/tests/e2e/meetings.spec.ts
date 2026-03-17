import { expect, test } from "@playwright/test";

test.describe("Meetings", () => {
  test("redirects unauthenticated user from /meetings to /login", async ({ page }) => {
    await page.goto("/meetings");
    await expect(page).toHaveURL(/\/login/);
    await expect(page).toHaveURL(/callbackUrl=%2Fmeetings/);
  });
});

test.describe("Meetings (authenticated)", () => {
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

  test("meetings page loads without redirect", async ({ page }) => {
    await page.goto("/meetings");
    await expect(page).not.toHaveURL(/\/login/);
  });

  test("meetings page has a heading", async ({ page }) => {
    await page.goto("/meetings");
    await expect(page.getByRole("heading", { name: /meetings intelligence/i })).toBeVisible();
  });

  test("schedule subpage loads", async ({ page }) => {
    await page.goto("/meetings/schedule");
    await expect(page).not.toHaveURL(/\/login/);
  });

  test("recordings subpage loads", async ({ page }) => {
    await page.goto("/meetings/recordings");
    await expect(page).not.toHaveURL(/\/login/);
  });
});

