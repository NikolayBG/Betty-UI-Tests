import { type Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { LoginModal } from './LoginModal';

export class ContentPage extends BasePage {
  footerLink(name: string): Locator {
    return this.footer.getByRole('link', { name });
  }

  async openPath(path: string): Promise<void> {
    await this.goto(path);
  }

  async expectHeading(text: string | RegExp): Promise<void> {
    await expect(this.page.getByText(text).first()).toBeVisible();
  }

  async openAccountAsGuest(): Promise<LoginModal> {
    await this.goto('/account');
    const modal = new LoginModal(this.page);
    await modal.expectVisible();
    return modal;
  }
}

export class GamesPage extends BasePage {
  async openLobby(): Promise<void> {
    await this.goto('/games');
  }

  async expectCategoriesVisible(): Promise<void> {
    await expect(this.page.getByText('Most Popular').first()).toBeVisible();
    await expect(this.page.getByText('See All Games').first()).toBeVisible();
  }

  async openAllGames(): Promise<void> {
    await this.goto('/all');
    await expect(this.page.getByText('All Games')).toBeVisible();
  }
}

export class PromosPage extends BasePage {
  get root(): Locator {
    return this.page.getByTestId('promos-component');
  }

  async open(): Promise<void> {
    await this.goto('/promos');
    await expect(this.page).toHaveTitle(/Offers/i);
    await expect(this.page.getByText("Betty Casino's Special Promos")).toBeVisible();
  }
}
