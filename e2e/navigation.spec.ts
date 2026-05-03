import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('bottom nav has all 5 tabs', async ({ page }) => {
    await page.goto('/auth/login');
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
    await expect(nav.locator('text=Inicio')).toBeVisible();
    await expect(nav.locator('text=Tareas')).toBeVisible();
    await expect(nav.locator('text=Bienestar')).toBeVisible();
    await expect(nav.locator('text=Progreso')).toBeVisible();
    await expect(nav.locator('text=Perfil')).toBeVisible();
  });
});
