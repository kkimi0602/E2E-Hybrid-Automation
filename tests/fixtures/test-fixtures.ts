import { test as base } from '@playwright/test';
import { AuthPage } from '../../pages/AuthPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { ProductsPage } from '../../pages/ProductsPage';
import { UserApi } from '../../api/user.api';
import { CartApi } from '../../api/cart.api';
import { AuthService } from '../../services/AuthService';
import { PurchaseService } from '../../services/PurchaseService';

interface AppFixtures {
  authPage: AuthPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  productsPage: ProductsPage;
  userApi: UserApi;
  cartApi: CartApi;
  authService: AuthService;
  purchaseService: PurchaseService;
}

const apiBaseUrl =
  process.env.API_BASE_URL || 'https://automationexercise.com/api';

export const test = base.extend<AppFixtures>({
  authPage: async ({ page }, use) => {
    await use(new AuthPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },
  userApi: async ({ request }, use) => {
    await use(new UserApi(request, apiBaseUrl));
  },
  cartApi: async ({ request }, use) => {
    await use(new CartApi(request, apiBaseUrl));
  },
  authService: async ({ authPage, userApi }, use) => {
    await use(new AuthService(authPage, userApi));
  },
  purchaseService: async (
    { cartApi, productsPage, cartPage, checkoutPage },
    use,
  ) => {
    await use(
      new PurchaseService(cartApi, productsPage, cartPage, checkoutPage),
    );
  },
});

export { expect } from '@playwright/test';
