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
  readonly placeOrderCta: Locator;
  readonly placeOrderButton: Locator;
  readonly successMessage: Locator;
  readonly orderItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.placeOrderCta = page.locator('a:has-text("Place Order")');
    this.placeOrderButton = page.locator('button[data-qa="pay-button"]');
    this.successMessage = page.locator('h2[data-qa="order-placed"]');
    this.orderItems = page.locator('#cart_info tr[id^="product-"]');
  }

  async goto(): Promise<void> {
    await this.page.goto('/checkout');
    await expect(this.page).toHaveURL(/\/checkout/);
  }

  async fillShippingDetails(details: ShippingDetails): Promise<void> {
    await this.page
      .locator('[name="name_on_card"], input[name="name_on_card"]')
      .fill(details.firstName);
    await this.page
      .locator('[name="card_number"], input[name="card_number"]')
      .fill(details.lastName);
    await this.page
      .locator('[name="cvc"], input[name="cvc"]')
      .fill(details.address);
    await this.page
      .locator('[name="expiry_month"], input[name="expiry_month"]')
      .fill(details.city);
    await this.page
      .locator('[name="expiry_year"], input[name="expiry_year"]')
      .fill(details.zipCode);
  }

  async proceedToPayment(): Promise<void> {
    await this.placeOrderCta.click();
    await expect(this.placeOrderButton).toBeVisible();
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

  async getCheckoutItemNames(): Promise<string[]> {
    return this.page
      .locator('#cart_info tr[id^="product-"] .cart_description h4 a')
      .allTextContents();
  }
}
