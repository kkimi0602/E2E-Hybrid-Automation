import { test, expect } from '@playwright/test';
import { UserApi, RegisterPayload } from '../../api/user.api';
import { testUsers } from '../../utils/testData';
import { randomEmail } from '../../utils/helpers';

test.describe('User API Tests', () => {
  let userApi: UserApi;
  const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000';

  test.beforeEach(async ({ request }) => {
    userApi = new UserApi(request, baseUrl);
  });

  test('should login and receive token', async () => {
    const response = await userApi.login({
      email: testUsers.standard.email,
      password: testUsers.standard.password,
    });

    expect(response.status()).toBe(200);
    const body = (await response.json()) as { token?: string };
    expect(body.token).toBeTruthy();
  });

  test('should return 401 on invalid credentials', async () => {
    const response = await userApi.login({
      email: testUsers.standard.email,
      password: 'wrongPassword123!',
    });

    expect(response.status()).toBe(401);
  });

  test('should register a new user', async () => {
    const newEmail = randomEmail('newuser');
    const registerPayload: RegisterPayload = {
      firstName: 'Test',
      lastName: 'User',
      email: newEmail,
      password: 'Password123!',
    };

    const response = await userApi.register(registerPayload);

    expect([201, 200]).toContain(response.status());
    const body = (await response.json()) as { userId?: string };
    expect(body.userId).toBeTruthy();
  });

  test('should get user profile with valid token', async () => {
    const loginResp = await userApi.login({
      email: testUsers.standard.email,
      password: testUsers.standard.password,
    });

    const loginBody = (await loginResp.json()) as { token: string };
    const token = loginBody.token;

    const profileResp = await userApi.getProfile(token);

    expect(profileResp.status()).toBe(200);
    const profileBody = (await profileResp.json()) as { email: string };
    expect(profileBody.email).toBe(testUsers.standard.email);
  });
});
