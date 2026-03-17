import { expect, test } from "@playwright/test";

test.describe("Voice Interface", () => {
  test("redirects unauthenticated user from /voice to /login", async ({ page }) => {
    await page.goto("/voice");
    await expect(page).toHaveURL(/\/login/);
    await expect(page).toHaveURL(/callbackUrl=%2Fvoice/);
  });
});

test.describe("Voice Interface (authenticated)", () => {
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

  test("voice page loads without redirect", async ({ page }) => {
    await page.goto("/voice");
    await expect(page).not.toHaveURL(/\/login/);
  });

  test("voice page has a heading", async ({ page }) => {
    await page.goto("/voice");
    await expect(page.getByRole("heading", { name: /voice assistant/i }).first()).toBeVisible();
  });

  test("voice page renders control buttons", async ({ page }) => {
    await page.goto("/voice");
    const buttons = page.getByRole("button");
    await expect(buttons.first()).toBeVisible();
  });
});

