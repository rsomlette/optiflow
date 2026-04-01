import { type Page, type Locator } from "@playwright/test";

export class DashboardPage {
  readonly page: Page;
  readonly newOrderButton: Locator;
  readonly scanReceivedButton: Locator;
  readonly signOutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newOrderButton = page.getByRole("button", { name: /new order/i });
    this.scanReceivedButton = page.getByRole("button", {
      name: /scan received/i,
    });
    this.signOutButton = page.getByRole("button", { name: /sign out/i });
  }

  async goto() {
    await this.page.goto("/dashboard");
  }

  getColumn(name: string) {
    return this.page.locator("h2", { hasText: name }).locator("..").locator("..");
  }

  getCard(clientName: string) {
    return this.page.locator("h3", { hasText: clientName }).locator("../..");
  }

  async getCardCount(columnName: string) {
    const column = this.getColumn(columnName);
    return column.locator("[class*='cursor-grab']").count();
  }

  async openNewOrderDialog() {
    await this.newOrderButton.click();
  }

  async signOut() {
    await this.signOutButton.click();
  }
}
