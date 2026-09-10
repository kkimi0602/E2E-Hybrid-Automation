import { expect, Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('[name="email"], #email');
    this.passwordInput = page.locator('[name="password"], #password');
    this.submitButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('[data-test="login-error"], .login-error');
  }

  async goto(path = '/login'): Promise<void> {
    await this.page.goto(path);
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async expectLoginError(containsText?: string): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    if (containsText) {
      await expect(this.errorMessage).toContainText(containsText);
    }
  }
}
