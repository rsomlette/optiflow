import { type Page, type Locator, expect } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly shopSelect: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.shopSelect = page.getByRole("combobox");
    this.submitButton = page.getByRole("button", {
      name: /continue to dashboard/i,
    });
  }

  async goto() {
    await this.page.goto("/login");
  }

  async selectShop(shopName: string) {
    await this.shopSelect.click();
    await this.page.getByRole("option", { name: shopName }).click();
  }

  async submit() {
    await this.submitButton.click();
  }

  async loginAs(shopName: string) {
    await this.goto();
    await this.selectShop(shopName);
    await this.submit();
    await expect(this.page).toHaveURL("/dashboard");
  }
}
