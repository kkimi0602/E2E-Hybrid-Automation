import { Page } from '@playwright/test';

export class AuthPage {
  constructor(private page: Page) {}

  async goToLogin() {
    await this.page.goto('/');
    await this.page.getByRole('link', { name: 'Signup / Login' }).click();
  }

  async signup(name: string, email: string) {
    await this.page.getByPlaceholder('Name').fill(name);
    await this.page.locator('input[data-qa="signup-email"]').fill(email);
    await this.page.getByRole('button', { name: 'Signup' }).click();
  }

  async login(email: string, password: string) {
    await this.page.locator('input[data-qa="login-email"]').fill(email);
    await this.page.locator('input[data-qa="login-password"]').fill(password);
    await this.page.getByRole('button', { name: 'Login' }).click();
  }
}
