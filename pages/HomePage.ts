import { type Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { LoginModal } from './LoginModal';

export class HomePage extends BasePage {
  get landingPage(): Locator {
    return this.page.getByTestId('landing-page');
  }

  get claimBonusButton(): Locator {
    // Prefer the landing CTA — a sticky promo can duplicate this test id.
    return this.page
      .getByTestId('landing-promo-container')
      .getByTestId('button-claimYourBonus');
  }

  get seeAllPromosButton(): Locator {
    return this.page.getByTestId('button-seeAllPromos');
  }

  get gamesCarousel(): Locator {
    return this.page.getByTestId('landing-carousel-games-section');
  }

  get promosSection(): Locator {
    return this.page.getByTestId('promos-section');
  }

  async open(): Promise<void> {
    await this.goto('/');
    await expect(this.landingPage).toBeVisible();
  }

  async openLogin(): Promise<LoginModal> {
    await this.loginButton.click();
    const modal = new LoginModal(this.page);
    await modal.expectVisible();
    return modal;
  }

  async goToRegisterViaJoin(): Promise<void> {
    await this.joinButton.click();
    await expect(this.page).toHaveURL(/\/register/);
  }
}
