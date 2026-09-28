import { type Locator, type Page } from '@playwright/test';

/**
 * Shared helpers for Betty pages (React Native Web / SPA).
 * Prefer data-testid selectors — they are more stable than CSS classes.
 */
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  async waitForAppReady(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    const spinner = this.page.locator('#spinner');
    if (await spinner.count()) {
      await spinner.waitFor({ state: 'hidden', timeout: 30_000 }).catch(() => undefined);
    }
    // Any known landmark means the SPA shell has mounted (.first avoids strict-mode on .or()).
    await this.page
      .locator(
        [
          '[data-testid="button-login"]',
          '[data-testid="landing-page"]',
          '[data-testid="nav-bar"]',
          '[data-testid="footer"]',
          '[data-testid="registration-step-email"]',
          '[data-testid="modal-Auth"]',
        ].join(', '),
      )
      .first()
      .waitFor({ state: 'visible', timeout: 30_000 });
  }

  async goto(path: string = '/'): Promise<void> {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    await this.waitForAppReady();
  }

  get loginButton(): Locator {
    return this.page.getByTestId('button-login');
  }

  get joinButton(): Locator {
    return this.page.getByTestId('button-join');
  }

  get logo(): Locator {
    return this.page.getByTestId('pressable-icon-newBettyLogo');
  }

  get footer(): Locator {
    return this.page.getByTestId('footer');
  }
}
