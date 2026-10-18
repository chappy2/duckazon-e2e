import { test, expect } from '@playwright/test';
test('Happy Duck: Ente bestellen', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Senior Debug Duck hinzufügen' }).click();
  await expect(page.getByTestId('cart-count')).toHaveText('1');
  await expect(page.getByTestId('total')).toHaveText('29,99 €');
  await page.getByRole('button', { name: 'Jetzt bestellen' }).click();
  await expect(page.getByRole('status')).toContainText('Bestellung bestätigt');
});
