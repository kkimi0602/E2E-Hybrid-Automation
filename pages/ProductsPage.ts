import { expect, Locator, Page } from '@playwright/test';

export class ProductsPage {
  readonly page: Page;
  readonly productCards: Locator;
  readonly continueShoppingButton: Locator;
  readonly viewCartModalLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productCards = page.locator('.features_items .product-image-wrapper');
    this.continueShoppingButton = page.locator(
      'button:has-text("Continue Shopping")',
    );
    this.viewCartModalLink = page.locator('u:has-text("View Cart")');
  }

  async goto(): Promise<void> {
    await this.page.goto('/products');
    await expect(this.page).toHaveURL(/\/products/);
  }

  async addProductToCartByName(productName: string): Promise<void> {
    const card = this.productCards.filter({ hasText: productName }).first();
    await card.hover();
    await card.locator('a:has-text("Add to cart")').first().click();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  async openCartFromModal(): Promise<void> {
    await this.viewCartModalLink.click();
  }
}
