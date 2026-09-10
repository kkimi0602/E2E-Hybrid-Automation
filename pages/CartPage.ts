import { expect, Locator, Page } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly emptyCartMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('tr[id^="product-"]');
    this.checkoutButton = page.locator('a:has-text("Proceed To Checkout")');
    this.emptyCartMessage = page.locator('#empty_cart p.text-center');
  }

  async goto(): Promise<void> {
    await this.page.goto('/view_cart');
    await expect(this.page).toHaveURL(/\/view_cart/);
  }

  async openFromHeader(): Promise<void> {
    await this.page.getByRole('link', { name: 'Cart' }).click();
    await expect(this.page).toHaveURL(/\/view_cart/);
  }

  async removeItemByName(productName: string): Promise<void> {
    const row = this.cartItems.filter({ hasText: productName }).first();
    await row.locator('a.cart_quantity_delete').click();
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async expectItemsCount(count: number): Promise<void> {
    await expect(this.cartItems).toHaveCount(count);
  }

  async expectContainsItem(productName: string): Promise<void> {
    await expect(
      this.cartItems.filter({ hasText: productName }).first(),
    ).toBeVisible();
  }

  async getItemNames(): Promise<string[]> {
    return this.page
      .locator('tr[id^="product-"] .cart_description h4 a')
      .allTextContents();
  }
}
