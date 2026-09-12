const { test, expect } = require('./fixtures/evinced');

test.use({ evMode: 'single' });

test('home page loads and is scanned once', async ({ page, evinced }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Love & Minter/);
  await expect(page.getByRole('link', { name: 'Catalog' }).first()).toBeVisible();

  const issues = await evinced.evAnalyze();
  expect(Array.isArray(issues)).toBe(true);
});
