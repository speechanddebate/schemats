import { expect, test } from '../../../../config/testing/playwright.setup';

test('has expected h1', async ({ page }) => {
	await page.goto('/demo/playwright');
	await expect(
		page.getByRole('heading', { level: 1, name: 'Playwright e2e test demo' }),
	).toBeVisible();
});
