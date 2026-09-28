import { test, expect } from '@playwright/test';
import { ContentPage, GamesPage } from '../pages/ContentPages';

test.describe('Critical pages', () => {
  test('TC-GAMES-001: games lobby shows key categories', async ({ page }) => {
    const games = new GamesPage(page);
    await games.openLobby();
    await games.expectCategoriesVisible();
  });

  test('TC-RG-001: responsible gaming states age and regulator', async ({ page }) => {
    const content = new ContentPage(page);
    await content.openPath('/responsible-gaming');
    await content.expectHeading(/Responsible Gaming/i);
    await expect(page.getByText(/18/i).first()).toBeVisible();
    await expect(page.getByText(/Kahnawake Gaming Commission/i).first()).toBeVisible();
  });
});
