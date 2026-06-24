import { test, expect } from '../../../../config/testing/playwright.setup';
import type { Page } from '@playwright/test';
import { getIndexCardsAPIMock  } from '../../../indexcards/index.msw';

import config from '$config';

const cookieName = config.indexcards.authCookieName;

const credentials = {
	username: 'user@example.com',
	password: 'password123',
};

const submitLogin = async (page: Page) => {
	const emailInput = page.getByLabel('Email');
	const passwordInput = page.getByLabel('Password');
	const submitButton = page.getByRole('button', { name: 'Sign in' });

	await emailInput.fill(credentials.username);
	await passwordInput.fill(credentials.password);

	await submitButton.click();
};

test('logs in the user', async ({ page }) => {

	await page.goto('/user/login');

	await submitLogin(page);

	await expect(page).toHaveURL('/');
});

import { http, HttpResponse } from 'msw';

test.beforeEach(async ({ network }) => {
	network.use(
		...getIndexCardsAPIMock(),

		// Override the generated login handler
		http.post('**/v1/auth/login', () => {
			return HttpResponse.json(
				{ ok: true },
				{
					headers: {
						'Set-Cookie': `${cookieName}=mock-session; Path=/`,
					},
				},
			);
		}),
	);
});
test('submits login from a gated redirect page', async ({ page }) => {

	await page.goto('/paradigms');

	await page.waitForURL('/user/login**');

	await submitLogin(page);

	await expect(page).toHaveURL('/paradigms');
});