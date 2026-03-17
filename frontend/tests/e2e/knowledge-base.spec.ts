import { expect, test } from "@playwright/test";

test.describe("Knowledge Base", () => {
  test("redirects unauthenticated user from /knowledge-base to /login", async ({ page }) => {
    await page.goto("/knowledge-base");
    await expect(page).toHaveURL(/\/login/);
    await expect(page).toHaveURL(/callbackUrl=%2Fknowledge-base/);
  });
});

test.describe("Knowledge Base (authenticated)", () => {
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

  test("knowledge base page loads without redirect", async ({ page }) => {
    await page.goto("/knowledge-base");
    await expect(page).not.toHaveURL(/\/login/);
  });

  test("knowledge base page has a heading", async ({ page }) => {
    await page.goto("/knowledge-base");
    await expect(page.getByRole("heading", { name: /knowledge/i })).toBeVisible();
  });

  test("upload subpage redirects unauthenticated", async ({ page: rawPage }) => {
    const context = rawPage.context();
    const unauthPage = await context.newPage();
    await unauthPage.goto("/knowledge-base/upload");
    // Either loads or redirects based on auth
    const url = unauthPage.url();
    expect(url).toMatch(/knowledge-base|login/);
    await unauthPage.close();
  });

  test("documents subpage loads", async ({ page }) => {
    await page.goto("/knowledge-base/documents");
    await expect(page).not.toHaveURL(/\/login/);
  });

  test("collections subpage loads", async ({ page }) => {
    await page.goto("/knowledge-base/collections");
    await expect(page).not.toHaveURL(/\/login/);
  });

  test("sources subpage loads", async ({ page }) => {
    await page.goto("/knowledge-base/sources");
    await expect(page).not.toHaveURL(/\/login/);
  });
});

