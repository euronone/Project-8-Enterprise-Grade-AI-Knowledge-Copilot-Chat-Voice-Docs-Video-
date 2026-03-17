import { expect, test } from "@playwright/test";

test.describe("Auth Flow", () => {
  test("redirects unauthenticated users to login", async ({ page }) => {
    await page.goto("/home");
    await expect(page).toHaveURL(/\/login/);
  });

  test("login page renders form elements", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByText("Welcome back")).toBeVisible();
    await expect(page.getByPlaceholder("Work email")).toBeVisible();
    await expect(page.getByPlaceholder("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
  });

  test("login page has SSO buttons", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("button", { name: "Google" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Microsoft" })).toBeVisible();
  });

  test("login page has navigation links", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByText("Forgot password?")).toBeVisible();
    await expect(page.getByText("Create account")).toBeVisible();
  });

  test("register page renders form", async ({ page }) => {
    await page.goto("/register");
    await expect(page.getByText("Create organization")).toBeVisible();
    await expect(page.getByPlaceholder("Work email")).toBeVisible();
    await expect(page.getByPlaceholder("Password")).toBeVisible();
  });

  test("forgot password page renders", async ({ page }) => {
    await page.goto("/forgot-password");
    await expect(page.getByText("Reset password")).toBeVisible();
    await expect(page.getByPlaceholder("Work email")).toBeVisible();
  });

  test("callback URL is preserved on redirect", async ({ page }) => {
    await page.goto("/analytics");
    await expect(page).toHaveURL(/callbackUrl/);
  });

  test("login form validates required fields", async ({ page }) => {
    await page.goto("/login");
    const emailInput = page.getByPlaceholder("Work email");
    await expect(emailInput).toHaveAttribute("required");
    const passwordInput = page.getByPlaceholder("Password");
    await expect(passwordInput).toHaveAttribute("required");
  });

  test("public auth routes are accessible without session", async ({ page }) => {
    // These routes should NOT redirect to login
    for (const path of ["/login", "/register", "/forgot-password", "/reset-password", "/sso"]) {
      await page.goto(path);
      await expect(page).not.toHaveURL(/\/login\?callbackUrl/);
    }
  });
});
