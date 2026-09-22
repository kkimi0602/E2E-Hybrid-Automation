import { expect } from '@playwright/test';
import { CartApi } from '../api/cart.api';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { ProductsPage } from '../pages/ProductsPage';
import { PaymentDetailsBuilder } from '../utils/factories/CheckoutFactory';

export class PurchaseService {
  constructor(
    private readonly cartApi: CartApi,
    private readonly productsPage: ProductsPage,
    private readonly cartPage: CartPage,
    private readonly checkoutPage: CheckoutPage,
  ) {}

  async addUiItemsAndValidateCart(productName: string): Promise<void> {
    await this.productsPage.goto();
    await this.productsPage.addProductToCartByName(productName);
    await this.productsPage.openCartFromModal();
    await this.cartPage.expectContainsItem(productName);
  }

  async completePurchaseAndValidateItemsMatch(): Promise<void> {
    const cartItemNames = await this.cartPage.getItemNames();
    expect(cartItemNames.length).toBeGreaterThan(0);

    await this.cartPage.proceedToCheckout();

    const checkoutItemNames = await this.checkoutPage.getCheckoutItemNames();
    expect(checkoutItemNames).toEqual(cartItemNames);

    await this.checkoutPage.proceedToPayment();
    await this.checkoutPage.fillShippingDetails(
      new PaymentDetailsBuilder().build(),
    );
    await this.checkoutPage.placeOrder();
    await this.checkoutPage.expectOrderSuccess('Order Placed!');
  }

  async tryAddCartViaApiAndCheckUi(
    authToken: string,
    productId: string,
    quantity: number,
    expectedProductName: string,
  ): Promise<'supported' | 'unsupported'> {
    const canUseApi = this.cartApi.supportsCartMutations();
    if (!canUseApi) {
      return 'unsupported';
    }

    const addResponse = await this.cartApi.addToCart(authToken, {
      productId,
      quantity,
    });
    expect(addResponse.ok()).toBeTruthy();

    await this.cartPage.openFromHeader();
    await this.cartPage.expectContainsItem(expectedProductName);
    return 'supported';
  }

  async expectOutOfStockFailure(
    authToken: string,
    productId: string,
  ): Promise<'supported' | 'unsupported'> {
    if (!this.cartApi.supportsCartMutations()) {
      return 'unsupported';
    }

    const response = await this.cartApi.addToCart(authToken, {
      productId,
      quantity: 9999,
    });

    expect(response.ok()).toBeFalsy();
    return 'supported';
  }
}
