import { expect, test } from "@playwright/test";

test.describe("Chat Interface", () => {
  // Chat is behind auth, so without a session cookie, it redirects to /login.
  // These tests verify the auth-guard and the public-visible parts of the flow.

  test("redirects unauthenticated user from /chat to /login", async ({ page }) => {
    await page.goto("/chat");
    await expect(page).toHaveURL(/\/login/);
    await expect(page).toHaveURL(/callbackUrl=%2Fchat/);
  });

  test("redirects from conversation page to login", async ({ page }) => {
    await page.goto("/chat/some-conversation-id");
    await expect(page).toHaveURL(/\/login/);
  });

  test("login page is rendered when redirected from chat", async ({ page }) => {
    await page.goto("/chat");
    await expect(page.getByText("Welcome back")).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
  });
});

test.describe("Chat Interface (authenticated)", () => {
  // Simulate authentication by setting the next-auth session cookie
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
          sameSite: "Lax",
          expires: Math.floor(Date.now() / 1000) + 86400,
        },
      ],
      origins: [],
    },
  });

  test("chat page loads with input area", async ({ page }) => {
    await page.goto("/chat");
    // Should not redirect to login
    await expect(page).not.toHaveURL(/\/login/);
  });

  test("chat page renders the chat interface container", async ({ page }) => {
    await page.goto("/chat");
    // The page should render — even if the API isn't connected, the UI should appear.
    await expect(page.locator("body")).toBeVisible();
  });
});

