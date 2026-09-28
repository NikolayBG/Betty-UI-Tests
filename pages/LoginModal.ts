import { type Locator, type Page, expect } from '@playwright/test';

export class LoginModal {
  readonly root: Locator;

  constructor(private readonly page: Page) {
    this.root = page.getByTestId('modal-Auth');
  }

  get emailInput(): Locator {
    return this.root.locator('input[type="email"]');
  }

  get passwordInput(): Locator {
    return this.root.locator('input[type="password"]');
  }

  get submitButton(): Locator {
    return this.root.getByRole('button', { name: 'Log In' });
  }

  get forgotPasswordLink(): Locator {
    return this.root.getByText('Forgot Password?');
  }

  get signUpLink(): Locator {
    return this.root.getByText('Sign Up', { exact: true });
  }

  get closeButton(): Locator {
    return this.page.getByTestId('pressable-icon-close');
  }

  get forgotPasswordSubmit(): Locator {
    return this.page.getByTestId('button-forgotPasswordButton');
  }

  async expectVisible(): Promise<void> {
    await expect(this.root).toBeVisible();
    await expect(this.root.getByText('Email', { exact: true })).toBeVisible();
    await expect(this.root.getByText('Password', { exact: true })).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }

  async expectHidden(): Promise<void> {
    await expect(this.root).toBeHidden();
  }

  async submitEmpty(): Promise<void> {
    await this.submitButton.click();
  }

  async expectRequiredFieldError(): Promise<void> {
    await expect(this.root.getByText('Email and password are required')).toBeVisible();
  }

  async openForgotPassword(): Promise<void> {
    await this.forgotPasswordLink.click();
    await expect(this.page.getByText('Reset your Betty password?')).toBeVisible();
    await expect(this.page.getByText('Send reset link')).toBeVisible();
  }

  async close(): Promise<void> {
    await this.closeButton.click();
    await this.expectHidden();
  }

  async goToSignUp(): Promise<void> {
    await this.signUpLink.click();
    await expect(this.page).toHaveURL(/\/register/);
  }
}
