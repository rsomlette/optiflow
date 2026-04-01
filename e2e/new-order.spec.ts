import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/login-page";
import { DashboardPage } from "./pages/dashboard-page";

test.describe("New Order", () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginAs("Optique Centrale Paris 11");
  });

  test("should open new order dialog", async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.openNewOrderDialog();
    await expect(page.getByText("New Order")).toBeVisible();
    await expect(page.getByText("Assigned Employee")).toBeVisible();
  });

  test("should create an order via manual flow", async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.openNewOrderDialog();

    // Select employee
    await page.getByRole("combobox").click();
    await page.getByRole("option", { name: /Marie Dupont/i }).click();

    // Choose manual flow
    await page.getByRole("button", { name: /manual entry/i }).click();

    // Fill form
    await page.getByLabel(/client name/i).fill("Test Client");
    await page.getByLabel(/phone/i).fill("+33 6 00 00 00 00");
    await page.getByLabel(/frame/i).fill("Test Frame");
    await page.getByLabel(/lens type/i).fill("Single Vision");

    // Submit
    await page.getByRole("button", { name: /create order/i }).click();

    // Card should appear in the first column
    await expect(
      page.locator("h3", { hasText: "Test Client" })
    ).toBeVisible();
  });
});
