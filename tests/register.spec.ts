import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';

test.describe('Registration', () => {
  test('TC-REG-001: register email step loads and empty email validates', async ({ page }) => {
    const register = new RegisterPage(page);
    await register.open();

    await expect(register.emailInput).toBeVisible();
    await expect(register.nextButton).toBeVisible();
    await expect(page.getByText(/I confirm that I am 18 or older/i)).toBeVisible();

    await register.submitEmptyEmailStep();
    await register.expectInvalidEmailError();
  });
});
