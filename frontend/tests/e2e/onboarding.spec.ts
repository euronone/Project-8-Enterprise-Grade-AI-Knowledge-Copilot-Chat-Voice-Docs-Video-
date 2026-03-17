import { expect, test } from "@playwright/test";

test.describe("Onboarding Flow", () => {
  test("register page loads", async ({ page }) => {
    await page.goto("/register");
    await expect(page.getByRole("heading", { name: /create organization/i })).toBeVisible();
  });

  test("register page renders name, email, password fields", async ({ page }) => {
    await page.goto("/register");
    await expect(page.getByPlaceholder(/full name/i)).toBeVisible();
    await expect(page.getByPlaceholder(/work email/i)).toBeVisible();
    await expect(page.getByPlaceholder(/password/i)).toBeVisible();
  });

  test("register page has a submit button", async ({ page }) => {
    await page.goto("/register");
    const submitButton = page.getByRole("button", { name: /create account/i });
    await expect(submitButton).toBeVisible();
  });

  test("register page links to login", async ({ page }) => {
    await page.goto("/register");
    const loginLink = page.getByRole("link", { name: /sign in/i });
    await expect(loginLink).toBeVisible();
  });

  test("login page links to register", async ({ page }) => {
    await page.goto("/login");
    const registerLink = page.getByRole("link", { name: /create account/i });
    await expect(registerLink).toBeVisible();
  });
});

