import { test, expect } from '@playwright/test';
//import { LoginPage } from '../../pages/LoginPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { UserApi } from '../../api/user.api';
import { CartApi, AddToCartPayload } from '../../api/cart.api';
import { testUsers, testProducts, shippingFixture } from '../../utils/testData';

test.describe('E2E Hybrid Tests - Complete Purchase Flow', () => {
  //const baseUrl = process.env.APP_BASE_URL || 'http://localhost:3000';
  const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000';

  //let loginPage: LoginPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;
  let userApi: UserApi;
  let cartApi: CartApi;
  let authToken: string;

  test.beforeEach(async ({ page, request }) => {
    //loginPage = new LoginPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    userApi = new UserApi(request, apiBaseUrl);
    cartApi = new CartApi(request, apiBaseUrl);

    // Step 1: API login to get auth token
    const loginResp = await userApi.login({
      email: testUsers.standard.email,
      password: testUsers.standard.password,
    });
    const loginBody = (await loginResp.json()) as { token: string };
    authToken = loginBody.token;
  });

  test('should complete purchase flow: API add -> UI checkout -> success', async ({
    page,
  }) => {
    // Step 1: API - Add product to cart
    const addPayload: AddToCartPayload = {
      productId: testProducts.backpack.id,
      quantity: testProducts.backpack.quantity,
    };
    const addResp = await cartApi.addToCart(authToken, addPayload);
    expect(addResp.status()).toBe(200);

    // Step 2: UI - Navigate and verify cart
    await cartPage.goto();
    await cartPage.expectItemsCount(1);

    // Step 3: UI - Proceed to checkout
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/\/checkout/);

    // Step 4: UI - Fill shipping and place order
    await checkoutPage.fillShippingDetails(shippingFixture);
    await checkoutPage.placeOrder();

    // Step 5: UI - Verify success
    await checkoutPage.expectOrderSuccess('Order placed successfully');
  });

  test('should clear cart via API and verify in UI', async () => {
    // Step 1: API - Add then clear cart
    const addPayload: AddToCartPayload = {
      productId: testProducts.backpack.id,
      quantity: 1,
    };
    await cartApi.addToCart(authToken, addPayload);

    const clearResp = await cartApi.clearCart(authToken);
    expect(clearResp.status()).toBe(200);

    // Step 2: UI - Navigate to cart and verify empty
    await cartPage.goto();
    await expect(cartPage.emptyCartMessage).toBeVisible();
  });
});
