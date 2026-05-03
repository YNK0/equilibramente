import { test, expect } from '@playwright/test';

test.describe('Perfil Page', () => {
  test('redirects to login when unauthenticated', async ({ page }) => {
    await page.goto('/perfil');
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});
