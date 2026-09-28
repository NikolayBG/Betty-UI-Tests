import { type Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class RegisterPage extends BasePage {
  get stepEmail(): Locator {
    return this.page.getByTestId('registration-step-email');
  }

  get emailInput(): Locator {
    // data-testid is on the <input> itself (RNW), not a wrapper.
    return this.page.getByTestId('input-container-emailLabel');
  }

  get nextButton(): Locator {
    return this.page.getByTestId('button-nextButton');
  }

  get heading(): Locator {
    return this.page.getByText('Register to Betty Casino');
  }

  async open(): Promise<void> {
    await this.goto('/register');
    await expect(this.heading).toBeVisible();
    await expect(this.stepEmail).toBeVisible();
  }

  async submitEmptyEmailStep(): Promise<void> {
    await this.nextButton.click();
  }

  async expectInvalidEmailError(): Promise<void> {
    await expect(this.page.getByText('Please enter a valid email address.')).toBeVisible();
  }
}
