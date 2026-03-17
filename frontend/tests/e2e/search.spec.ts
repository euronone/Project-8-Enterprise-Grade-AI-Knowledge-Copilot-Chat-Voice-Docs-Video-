import { expect, test } from "@playwright/test";

test.describe("Search Interface", () => {
  test("redirects unauthenticated user from /search to /login", async ({ page }) => {
    await page.goto("/search");
    await expect(page).toHaveURL(/\/login/);
    await expect(page).toHaveURL(/callbackUrl=%2Fsearch/);
  });
});

test.describe("Search Interface (authenticated)", () => {
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

  test("search page loads without redirect", async ({ page }) => {
    await page.goto("/search");
    await expect(page).not.toHaveURL(/\/login/);
  });

  test("search page has a heading", async ({ page }) => {
    await page.goto("/search");
    await expect(page.getByRole("heading", { name: /search/i })).toBeVisible();
  });

  test("search page renders an input field", async ({ page }) => {
    await page.goto("/search");
    const input = page.getByPlaceholder(/search/i);
    await expect(input).toBeVisible();
  });

  test("search input accepts text", async ({ page }) => {
    await page.goto("/search");
    const input = page.getByPlaceholder(/search/i);
    await input.fill("test query");
    await expect(input).toHaveValue("test query");
  });
});

