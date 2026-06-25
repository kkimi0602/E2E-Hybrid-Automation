import { expect, Locator, Page } from '@playwright/test';

export interface ShippingDetails {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
}

export class CheckoutPage {
  readonly page: Page;
  readonly placeOrderButton: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.placeOrderButton = page.locator(
      '[data-test="place-order"], button:has-text("Place order")',
    );
    this.successMessage = page.locator(
      '[data-test="order-success"], .order-success',
    );
  }

  async goto(path = '/checkout'): Promise<void> {
    await this.page.goto(path);
  }

  async fillShippingDetails(details: ShippingDetails): Promise<void> {
    await this.page
      .locator('[name="firstName"], #firstName')
      .fill(details.firstName);
    await this.page
      .locator('[name="lastName"], #lastName')
      .fill(details.lastName);
    await this.page.locator('[name="address"], #address').fill(details.address);
    await this.page.locator('[name="city"], #city').fill(details.city);
    await this.page.locator('[name="zipCode"], #zipCode').fill(details.zipCode);
    await this.page.locator('[name="country"], #country').fill(details.country);
  }

  async placeOrder(): Promise<void> {
    await this.placeOrderButton.click();
  }

  async expectOrderSuccess(containsText?: string): Promise<void> {
    await expect(this.successMessage).toBeVisible();
    if (containsText) {
      await expect(this.successMessage).toContainText(containsText);
    }
  }
}
