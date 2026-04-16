import { test, expect } from '../../../../config/testing/playwright.setup';
test('logs in the user', async ({ page }) => {
	await page.goto('/user/login');
	const emailInput = page.getByLabel('Email');
	const passwordInput = page.getByLabel('Password');
	const submitButton = page.getByRole('button', { name: /sign in/i });

	await expect(emailInput).toBeVisible();
	await expect(passwordInput).toBeVisible();
	await expect(submitButton).toBeVisible();

	await emailInput.fill('user@example.com');
	await passwordInput.fill('password123');

	const [loginRequest] = await Promise.all([
		page.waitForRequest(
			(request) =>
				request.url().includes('/v1/auth/login') &&
				request.method() === 'POST',
		),
		submitButton.click(),
	]);

	const requestPayload = loginRequest.postDataJSON() as {
		username?: string;
		password?: string;
	};

	expect(requestPayload).toMatchObject({
		username: 'user@example.com',
		password: 'password123',
	});
});