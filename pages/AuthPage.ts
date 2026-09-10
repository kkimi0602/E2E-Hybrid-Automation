import { expect, Locator, Page } from '@playwright/test';

export interface SignupDetails {
  title: 'Mr' | 'Mrs';
  name: string;
  email: string;
  password: string;
  day: string;
  month: string;
  year: string;
  firstName: string;
  lastName: string;
  company: string;
  address1: string;
  address2: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobileNumber: string;
}

export class AuthPage {
  readonly page: Page;
  readonly signupNameInput: Locator;
  readonly signupEmailInput: Locator;
  readonly signupButton: Locator;
  readonly loginEmailInput: Locator;
  readonly loginPasswordInput: Locator;
  readonly loginButton: Locator;
  readonly loginError: Locator;
  readonly loggedInAsLink: Locator;
  readonly accountCreatedHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.signupNameInput = page.locator('input[data-qa="signup-name"]');
    this.signupEmailInput = page.locator('input[data-qa="signup-email"]');
    this.signupButton = page.locator('button[data-qa="signup-button"]');
    this.loginEmailInput = page.locator('input[data-qa="login-email"]');
    this.loginPasswordInput = page.locator('input[data-qa="login-password"]');
    this.loginButton = page.locator('button[data-qa="login-button"]');
    this.loginError = page.locator('form[action="/login"] p');
    this.loggedInAsLink = page.locator('a:has-text("Logged in as")');
    this.accountCreatedHeader = page.locator('h2[data-qa="account-created"]');
  }

  async gotoHome(): Promise<void> {
    await this.page.goto('/');
    await this.dismissCookieConsentIfPresent();
  }

  async goToLogin(): Promise<void> {
    await this.gotoHome();
    await this.page.getByRole('link', { name: 'Signup / Login' }).click();
    await expect(this.loginButton).toBeVisible();
  }

  async submitSignupStep(name: string, email: string): Promise<void> {
    await this.signupNameInput.fill(name);
    await this.signupEmailInput.fill(email);
    await this.signupButton.click();
  }

  async completeSignup(details: SignupDetails): Promise<void> {
    await this.page
      .locator(details.title === 'Mr' ? '#id_gender1' : '#id_gender2')
      .check();
    await this.page.locator('#password').fill(details.password);
    await this.page.locator('#days').selectOption(details.day);
    await this.page.locator('#months').selectOption(details.month);
    await this.page.locator('#years').selectOption(details.year);

    await this.page.locator('#first_name').fill(details.firstName);
    await this.page.locator('#last_name').fill(details.lastName);
    await this.page.locator('#company').fill(details.company);
    await this.page.locator('#address1').fill(details.address1);
    await this.page.locator('#address2').fill(details.address2);
    await this.page.locator('#country').selectOption(details.country);
    await this.page.locator('#state').fill(details.state);
    await this.page.locator('#city').fill(details.city);
    await this.page.locator('#zipcode').fill(details.zipcode);
    await this.page.locator('#mobile_number').fill(details.mobileNumber);

    await this.dismissCookieConsentIfPresent();
    await this.page.locator('button[data-qa="create-account"]').click();
    await expect(this.accountCreatedHeader).toBeVisible();
    await this.dismissCookieConsentIfPresent();
    await this.page.locator('a[data-qa="continue-button"]').click();
  }

  async login(email: string, password: string): Promise<void> {
    await this.loginEmailInput.fill(email);
    await this.loginPasswordInput.fill(password);
    await this.loginButton.click();
  }

  async expectLoginError(containsText?: string): Promise<void> {
    await expect(this.loginError).toBeVisible();
    if (containsText) {
      await expect(this.loginError).toContainText(containsText);
    }
  }

  async expectLoggedIn(): Promise<void> {
    await expect(this.loggedInAsLink).toBeVisible();
  }

  async logout(): Promise<void> {
    await this.page.getByRole('link', { name: 'Logout' }).click();
    await expect(this.loginButton).toBeVisible();
  }

  async deleteLoggedInAccount(): Promise<void> {
    await this.page.getByRole('link', { name: 'Delete Account' }).click();
    await expect(
      this.page.locator('h2[data-qa="account-deleted"]'),
    ).toBeVisible();
    await this.page.locator('a[data-qa="continue-button"]').click();
  }

  private async dismissCookieConsentIfPresent(): Promise<void> {
    const consentButton = this.page.locator(
      'button.fc-cta-consent, button[aria-label*="consent" i], button:has-text("Consent")',
    );

    if (
      await consentButton
        .first()
        .isVisible({ timeout: 2000 })
        .catch(() => false)
    ) {
      await consentButton.first().click();
    }
  }
}
