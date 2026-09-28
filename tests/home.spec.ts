import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test.describe('Home', () => {
  test('TC-HOME-001: home loads with primary CTAs', async ({ page }) => {
    const home = new HomePage(page);
    await home.open();

    await expect(page).toHaveTitle(/Betty/i);
    await expect(home.loginButton).toBeVisible();
    await expect(home.joinButton).toBeVisible();
    await expect(home.claimBonusButton).toBeVisible();
    await expect(home.gamesCarousel).toBeVisible();
    await expect(home.footer).toBeVisible();
  });
});
