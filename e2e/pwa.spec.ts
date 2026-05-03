import { test, expect } from '@playwright/test';

test.describe('PWA', () => {
  test('manifest.json is served', async ({ page }) => {
    const response = await page.goto('/manifest.json');
    expect(response?.status()).toBe(200);
    const json = await response?.json();
    expect(json.name).toBe('EquilibraMente');
    expect(json.icons.length).toBeGreaterThan(0);
  });

  test('service worker is served', async ({ page }) => {
    const response = await page.goto('/sw.js');
    expect(response?.status()).toBe(200);
    const text = await response?.text();
    expect(text).toContain('install');
    expect(text).toContain('activate');
    expect(text).toContain('push');
  });

  test('icons are accessible', async ({ page }) => {
    const r192 = await page.goto('/icons/icon-192.png');
    expect(r192?.status()).toBe(200);

    const r512 = await page.goto('/icons/icon-512.png');
    expect(r512?.status()).toBe(200);

    const rApple = await page.goto('/icons/apple-touch-icon.png');
    expect(rApple?.status()).toBe(200);
  });

  test('meta tags are present', async ({ page }) => {
    await page.goto('/auth/login');
    const manifest = page.locator('link[rel="manifest"]');
    await expect(manifest).toHaveAttribute('href', '/manifest.json');

    const appleIcon = page.locator('link[rel="apple-touch-icon"]');
    await expect(appleIcon).toBeVisible();
  });
});
