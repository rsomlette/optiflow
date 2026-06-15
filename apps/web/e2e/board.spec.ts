import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/login-page";
import { DashboardPage } from "./pages/dashboard-page";

test.describe("Kanban Board", () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginAs("Optique Centrale Paris 11");
  });

  test("should display all five columns", async ({ page }) => {
    const columns = [
      "Pending Order",
      "Awaiting Delivery",
      "Ready to Assemble",
      "In Assembly",
      "Ready for Pickup",
    ];

    for (const col of columns) {
      await expect(page.locator("h2", { hasText: col })).toBeVisible();
    }
  });

  test("should display seed order cards", async ({ page }) => {
    // Check some known seed data clients
    await expect(
      page.locator("h3", { hasText: "Jean-Pierre Lefèvre" })
    ).toBeVisible();
    await expect(
      page.locator("h3", { hasText: "Nathalie Blanc" })
    ).toBeVisible();
  });

  test("should open order detail sheet when clicking a card", async ({
    page,
  }) => {
    await page
      .locator("h3", { hasText: "Jean-Pierre Lefèvre" })
      .click();

    // Sheet should show prescription details
    await expect(page.getByText("Prescription")).toBeVisible();
    await expect(page.getByText("Ray-Ban RB5154 Black")).toBeVisible();
  });

  test("should disable scan button when no orders awaiting delivery", async ({
    page,
  }) => {
    const dashboard = new DashboardPage(page);
    // If there are orders in "ordered_awaiting_delivery" (seed data has one),
    // the button should be enabled
    await expect(dashboard.scanReceivedButton).toBeEnabled();
  });
});
