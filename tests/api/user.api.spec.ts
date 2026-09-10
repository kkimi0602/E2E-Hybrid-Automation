import { test, expect } from '../fixtures/test-fixtures';
import { SignupDataBuilder } from '../../utils/factories/UserFactory';

test.describe('User API Tests', () => {
  test('should verify login with valid credentials', async ({ userApi }) => {
    const user = new SignupDataBuilder().build();
    const registerResponse = await userApi.register({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
    });

    expect(registerResponse.status()).toBe(200);

    const response = await userApi.login({
      email: user.email,
      password: user.password,
    });

    expect(response.status()).toBe(200);
    const body = (await response.json()) as { responseCode?: number };
    expect(body.responseCode).toBe(200);
  });

  test('should return validation failure on invalid credentials', async ({
    userApi,
  }) => {
    const user = new SignupDataBuilder().build();
    const response = await userApi.login({
      email: user.email,
      password: 'wrongPassword123!',
    });

    expect(response.status()).toBe(200);
    const body = (await response.json()) as { responseCode?: number };
    expect(body.responseCode).toBe(404);
  });

  test('should register a new user through API', async ({ userApi }) => {
    const signupData = new SignupDataBuilder().build();
    const response = await userApi.register({
      firstName: signupData.firstName,
      lastName: signupData.lastName,
      email: signupData.email,
      password: signupData.password,
    });

    expect(response.status()).toBe(200);
    const body = (await response.json()) as { responseCode?: number };
    expect(body.responseCode).toBe(201);
  });

  test('should fetch user details by email', async ({ userApi }) => {
    const user = new SignupDataBuilder().build();
    const registerResponse = await userApi.register({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
    });
    expect(registerResponse.status()).toBe(200);

    const profileResp = await userApi.getProfile(user.email);

    expect(profileResp.status()).toBe(200);
    const profileBody = (await profileResp.json()) as {
      responseCode?: number;
      user?: { email?: string };
    };
    expect(profileBody.responseCode).toBe(200);
    expect(profileBody.user?.email).toBe(user.email);
  });
});
