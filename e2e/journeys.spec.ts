import { expect, test } from '@playwright/test';

const routes = ['/', '/system', '/dashboard', '/calculator', '/guide', '/research'] as const;

test.describe('SolarCool Rural journeys', () => {
  for (const route of routes) {
    test(`renders ${route}`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.ok()).toBeTruthy();
      await expect(page.locator('#main-content')).toBeVisible();
    });
  }

  test('calculator updates energy difference from entered watts', async ({ page }) => {
    await page.goto('/calculator');
    await page.getByLabel(/Baseline power/).fill('1000');
    await page.getByLabel(/Proposed power/).fill('18');
    await page.getByLabel(/Operating hours/).fill('8');
    await page.getByLabel(/Operating days/).fill('365');
    await page.getByLabel(/Electricity tariff/).fill('8');
    await expect(page.getByText('2,867.4')).toBeVisible();
    await expect(page.getByText(/watts to kilowatts once/i)).toBeVisible();
  });

  test('dashboard can create a session and a measurement', async ({ page }) => {
    await page.goto('/dashboard');
    await page.getByLabel('Title').fill('Playwright session');
    await page.getByLabel('Location').fill('Test site');
    await page.getByLabel('Configuration').fill('Shading only, fan off');
    await page.getByLabel('Sensor details').fill('Logger A, ±0.5 °C, 1.2 m');
    await page.getByRole('button', { name: 'Save session' }).click();
    await expect(page.getByText('Session saved on this device.')).toBeVisible();

    await page.getByLabel(/Outdoor temperature/).fill('31');
    await page.getByLabel(/Baseline indoor/).fill('34');
    await page.getByLabel(/System indoor/).fill('32.5');
    await page.getByRole('button', { name: 'Add measurement' }).click();
    await expect(page.getByText('Measurement recorded.')).toBeVisible();
    await expect(page.getByText('1.5 °C')).toBeVisible();

    await page.reload();
    await expect(page.getByRole('option', { name: /Playwright session/ })).toHaveCount(1);
    await expect(page.getByText('1.5 °C')).toBeVisible();
  });
});
