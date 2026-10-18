import { test, expect } from '@playwright/test';
test('QUACK50 halbiert den Preis', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Senior Debug Duck hinzufügen' }).click();
  await page.getByLabel('Rabattcode').fill('QUACK50');
  await page.getByRole('button', { name: 'Einlösen' }).click();
  await expect(page.getByTestId('total')).toHaveText('15,00 €');
});
