import { expect, test } from "@playwright/test";

test.describe("Dashboard Navigation", () => {
  // Use authenticated state for dashboard tests
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

  test("home page loads with stats", async ({ page }) => {
    await page.goto("/home");
    await expect(page.getByText("Command Center")).toBeVisible();
    await expect(page.getByText("Queries Today")).toBeVisible();
    await expect(page.getByText("Active Users")).toBeVisible();
  });

  test("sidebar navigation links are present", async ({ page }) => {
    await page.goto("/home");
    await expect(page.getByRole("link", { name: "Home" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Chat" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Voice" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Search" })).toBeVisible();
  });

  test("search page loads", async ({ page }) => {
    await page.goto("/search");
    await expect(page).toHaveURL(/\/search/);
    await expect(page.locator("body")).toBeVisible();
  });

  test("knowledge base page loads", async ({ page }) => {
    await page.goto("/knowledge-base");
    await expect(page).toHaveURL(/\/knowledge-base/);
    await expect(page.locator("body")).toBeVisible();
  });

  test("analytics page loads", async ({ page }) => {
    await page.goto("/analytics");
    await expect(page).toHaveURL(/\/analytics/);
    await expect(page.locator("body")).toBeVisible();
  });

  test("can navigate to admin", async ({ page }) => {
    await page.goto("/home");
    await page.getByRole("link", { name: "Admin" }).click();
    await expect(page).toHaveURL(/\/admin/);
  });

  test("voice page loads", async ({ page }) => {
    await page.goto("/voice");
    await expect(page.locator("body")).toBeVisible();
  });

  test("workflows page loads with table", async ({ page }) => {
    await page.goto("/workflows");
    await expect(page.getByRole("heading", { name: "Workflows" })).toBeVisible();
  });

  test("agents page loads", async ({ page }) => {
    await page.goto("/agents");
    await expect(page.getByRole("heading", { name: "AI Agents" })).toBeVisible();
  });

  test("notifications page loads", async ({ page }) => {
    await page.goto("/notifications");
    await expect(page.getByText("Notifications")).toBeVisible();
  });

  test("profile page loads", async ({ page }) => {
    await page.goto("/profile");
    await expect(page.getByText("Profile")).toBeVisible();
  });

  test("teams page loads", async ({ page }) => {
    await page.goto("/teams");
    await expect(page.getByText("Teams")).toBeVisible();
  });

  test("playground page loads", async ({ page }) => {
    await page.goto("/playground");
    await expect(page.getByRole("heading", { name: "AI Prompt Playground" })).toBeVisible();
  });
});

test.describe("Admin Pages Navigation", () => {
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

  test("admin users page loads", async ({ page }) => {
    await page.goto("/admin/users");
    await expect(page.getByText("User Management")).toBeVisible();
  });

  test("admin roles page loads", async ({ page }) => {
    await page.goto("/admin/roles");
    await expect(page.getByText("Roles")).toBeVisible();
  });

  test("admin security page loads", async ({ page }) => {
    await page.goto("/admin/security");
    await expect(page.getByRole("heading", { name: "Security Settings" })).toBeVisible();
  });

  test("admin system health page loads", async ({ page }) => {
    await page.goto("/admin/system-health");
    await expect(page.getByText("System Health")).toBeVisible();
  });

  test("admin billing page loads", async ({ page }) => {
    await page.goto("/admin/billing");
    await expect(page.getByText("Billing")).toBeVisible();
  });

  test("admin audit logs page loads", async ({ page }) => {
    await page.goto("/admin/audit-logs");
    await expect(page.getByText("Audit Logs")).toBeVisible();
  });
});
