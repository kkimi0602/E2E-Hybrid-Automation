import { test } from '../fixtures/test-fixtures';

test.describe('Login UI Tests', () => {
  test('should login with valid credentials', async ({ authService }) => {
    await authService.registerLogoutAndLoginAgain();
  });

  test('should display error on invalid password', async ({ authService }) => {
    await authService.registerAndAttemptInvalidLogin(
      'Your email or password is incorrect!',
    );
  });
});
