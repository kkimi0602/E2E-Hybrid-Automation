import { test, expect } from '../fixtures/test-fixtures';
import { buildPrimaryProduct } from '../../utils/testData';

test.describe('E2E Hybrid Tests - Purchase Flow', () => {
  test('should register via UI and verify user via API', async ({
    authService,
  }) => {
    const registered = await authService.registerViaUiAndVerifyViaApi();
    expect(registered.email).toContain('@');
  });

  test('should add item via UI and complete purchase with data consistency check', async ({
    authService,
    purchaseService,
  }) => {
    const product = buildPrimaryProduct();
    await authService.registerViaUi();
    await purchaseService.addUiItemsAndValidateCart(product.name);
    await purchaseService.completePurchaseAndValidateItemsMatch();
  });

  test('should document unsupported API cart mutation on AutomationExercise', async ({
    purchaseService,
    cartApi,
  }) => {
    const product = buildPrimaryProduct();
    test.skip(
      !cartApi.supportsCartMutations(),
      'AutomationExercise public API does not expose cart mutation endpoints.',
    );

    const result = await purchaseService.tryAddCartViaApiAndCheckUi(
      'token-not-used-in-this-environment',
      product.id,
      product.quantity,
      product.name,
    );

    expect(result).toBe('supported');
  });

  test('should fail when attempting out-of-stock purchase via API', async ({
    purchaseService,
    cartApi,
  }) => {
    const product = buildPrimaryProduct();
    test.skip(
      !cartApi.supportsCartMutations(),
      'Out-of-stock API scenario is not available on AutomationExercise public API.',
    );

    const result = await purchaseService.expectOutOfStockFailure(
      'token-not-used-in-this-environment',
      product.id,
    );
    expect(result).toBe('supported');
  });
});
