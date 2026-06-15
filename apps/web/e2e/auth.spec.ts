import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/login-page";

test.describe("Authentication", () => {
  test("should redirect /dashboard to /login when not authenticated", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL("/login");
  });

  test("should login by selecting a shop", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginAs("Optique Centrale Paris 11");
    await expect(page).toHaveURL("/dashboard");
  });

  test("should disable submit button when no shop is selected", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await expect(loginPage.submitButton).toBeDisabled();
  });

  test("should sign out and redirect to login", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginAs("Optique Centrale Paris 11");

    await page.getByRole("button", { name: /sign out/i }).click();
    await expect(page).toHaveURL("/login");
  });
});
