import { test, expect } from '@playwright/test';
test('Broken Duck: absichtlicher Rabatt-Bug für Breakpoint-Demo', async ({ page }) => {
  await page.goto('/?bug=discount');
  await page.getByRole('button', { name: 'Senior Debug Duck hinzufügen' }).click();
  await page.getByLabel('Rabattcode').fill('QUACK50');
  await page.getByRole('button', { name: 'Einlösen' }).click();
  // BREAKPOINT HIER: Browser in noVNC beobachten, dann total inspizieren.
  const total = await page.getByTestId('total').innerText();
  expect(total).toBe('15,00 €'); // Soll absichtlich fehlschlagen (17,99 €)
});
