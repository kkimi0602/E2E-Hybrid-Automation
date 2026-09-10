import { expect } from '@playwright/test';
import { AuthPage } from '../pages/AuthPage';
import { UserApi } from '../api/user.api';
import { SignupDataBuilder } from '../utils/factories/UserFactory';
import { SignupDetails } from '../pages/AuthPage';

export class AuthService {
  constructor(
    private readonly authPage: AuthPage,
    private readonly userApi: UserApi,
  ) {}

  async registerViaUi(): Promise<SignupDetails> {
    const signupData = new SignupDataBuilder().build();

    await this.authPage.goToLogin();
    await this.authPage.submitSignupStep(signupData.name, signupData.email);
    await this.authPage.completeSignup(signupData);
    await this.authPage.expectLoggedIn();

    return signupData;
  }

  async registerViaUiAndVerifyViaApi(): Promise<{
    email: string;
    name: string;
  }> {
    const signupData = await this.registerViaUi();

    const detailsResponse = await this.userApi.getUserByEmail(signupData.email);
    expect(detailsResponse.status()).toBe(200);

    const detailsBody = (await detailsResponse.json()) as {
      responseCode?: number;
      user?: { email?: string };
    };

    expect(detailsBody.responseCode).toBe(200);
    expect(detailsBody.user?.email).toBe(signupData.email);

    return { email: signupData.email, name: signupData.name };
  }

  async registerLogoutAndLoginAgain(): Promise<void> {
    const user = await this.registerViaUi();
    await this.authPage.logout();
    await this.authPage.login(user.email, user.password);
    await this.authPage.expectLoggedIn();
  }

  async registerAndAttemptInvalidLogin(expectedError: string): Promise<void> {
    const user = await this.registerViaUi();
    await this.authPage.logout();
    await this.loginExpectError(user.email, 'wrongPassword123!', expectedError);
  }

  async loginExpectSuccess(email: string, password: string): Promise<void> {
    await this.authPage.goToLogin();
    await this.authPage.login(email, password);
    await this.authPage.expectLoggedIn();
  }

  async loginExpectError(
    email: string,
    password: string,
    expected: string,
  ): Promise<void> {
    await this.authPage.goToLogin();
    await this.authPage.login(email, password);
    await this.authPage.expectLoginError(expected);
  }
}
