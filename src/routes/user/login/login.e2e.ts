import { test, expect } from '../../../../config/testing/playwright.setup';
import type { Page, Response } from '@playwright/test';
import { getAuthLoginMockHandler } from '../../../indexcards/index.msw';

const credentials = {
	username: 'user@example.com',
	password: 'password123',
};

const submitLogin = async (page: Page) => {
	const emailInput = page.getByLabel('Email');
	const passwordInput = page.getByLabel('Password');
	const submitButton = page.getByRole('button', { name: /sign in/i });

	await expect(emailInput).toBeVisible();
	await expect(passwordInput).toBeVisible();
	await expect(submitButton).toBeVisible();

	await emailInput.fill(credentials.username);
	await passwordInput.fill(credentials.password);

	const [loginResponse] = await Promise.all([
		page.waitForResponse(
			(response: Response) =>
				response.url().includes('/v1/auth/login') &&
				response.request().method() === 'POST',
		),
		submitButton.click(),
	]);

	expect(loginResponse.ok()).toBeTruthy();

	return loginResponse.request().postDataJSON() as {
		username?: string;
		password?: string;
	};
};

test.beforeEach(async ({ network }) => {
	network.use(getAuthLoginMockHandler());
});

test('logs in the user', async ({ page }) => {

	await page.goto('/user/login');
	const requestPayload = await submitLogin(page);

	expect(requestPayload).toMatchObject({
		username: credentials.username,
		password: credentials.password,
	});
});

test('submits login from a gated redirect page', async ({ page }) => {
	await page.goto('/paradigms');
	await page.waitForURL('/user/login**');
	const requestPayload = await submitLogin(page);

	expect(requestPayload).toMatchObject({
		username: credentials.username,
		password: credentials.password,
	});
});
