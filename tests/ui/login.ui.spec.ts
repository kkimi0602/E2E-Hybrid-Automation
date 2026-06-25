import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { testUsers } from '../../utils/testData';

test.describe('Login UI Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should login with valid credentials', async ({ page }) => {
    await loginPage.login(
      testUsers.standard.email,
      testUsers.standard.password,
    );

    // After successful login, check URL changed or a welcome message appeared
    await expect(page).toHaveURL(/\/(dashboard|home)/);
  });

  test('should display error on invalid password', async () => {
    await loginPage.login(testUsers.standard.email, 'wrongPassword123!');

    await loginPage.expectLoginError('Invalid credentials');
  });

  test('should display error on empty email', async () => {
    await loginPage.login('', testUsers.standard.password);

    await loginPage.expectLoginError();
  });
});
