import { test, expect } from '../../config/testing/playwright.setup';
test('has expected login and signup buttons', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByText('Login')).toBeVisible();
	await expect(page.getByText('Sign Up')).toBeVisible();
});
