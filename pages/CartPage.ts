import { expect, Locator, Page } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly totalPrice: Locator;
  readonly checkoutButton: Locator;
  readonly emptyCartMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('[data-test="cart-item"], .cart-item');
    this.totalPrice = page.locator('[data-test="cart-total"], .cart-total');
    this.checkoutButton = page.locator(
      '[data-test="checkout"], button:has-text("Checkout")',
    );
    this.emptyCartMessage = page.locator(
      '[data-test="cart-empty"], .cart-empty',
    );
  }

  async goto(path = '/cart'): Promise<void> {
    await this.page.goto(path);
  }

  async removeItemByName(productName: string): Promise<void> {
    const row = this.page
      .locator('[data-test="cart-item"], .cart-item')
      .filter({ hasText: productName })
      .first();

    await row
      .locator('button:has-text("Remove"), [data-test="remove-item"]')
      .click();
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async expectItemsCount(count: number): Promise<void> {
    await expect(this.cartItems).toHaveCount(count);
  }
}
