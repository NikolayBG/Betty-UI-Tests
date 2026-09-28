import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ContentPage } from '../pages/ContentPages';

test.describe('Auth', () => {
  test('TC-AUTH-001: login modal opens and empty submit validates', async ({ page }) => {
    const home = new HomePage(page);
    await home.open();
    const login = await home.openLogin();

    await expect(login.forgotPasswordLink).toBeVisible();
    await login.submitEmpty();
    await login.expectRequiredFieldError();
  });

  test('TC-AUTH-002: Join Betty opens registration', async ({ page }) => {
    const home = new HomePage(page);
    await home.open();
    await home.goToRegisterViaJoin();
    await expect(page.getByText('Register to Betty Casino')).toBeVisible();
  });

  test('TC-AUTH-003: guest /account requires login', async ({ page }) => {
    const content = new ContentPage(page);
    const login = await content.openAccountAsGuest();
    await login.expectVisible();
  });
});
