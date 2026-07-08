import { test, expect } from '../../../../config/testing/playwright.setup';
import type { Page } from '@playwright/test';
import { http, HttpResponse } from 'msw';
import { getIndexCardsAPIMock  } from '../../../indexcards/index.msw';

const cookieName = 'TabroomToken';
const indexcardsBasePath = process.env.INDEXCARDS_BASE_PATH ?? '/v1';

const credentials = {
	username: 'user@example.com',
	password: 'password123',
};

const submitLogin = async (page: Page) => {
	await page.waitForLoadState('networkidle');

	const emailInput = page.getByLabel('Email');
	const passwordInput = page.getByLabel('Password');
	const submitButton = page.getByRole('button', { name: 'Sign in' });

	await emailInput.fill(credentials.username);
	await passwordInput.fill(credentials.password);

	await submitButton.click();
};

test.beforeEach(async ({ network }) => {
	network.use(
		...getIndexCardsAPIMock(),

		// Override the generated login handler
		http.post(`**${indexcardsBasePath}/auth/login`, () => {
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

test('logs in the user', async ({ page }) => {
	await page.goto('/user/login');

	await submitLogin(page);

	await expect(page).toHaveURL('/');
});

test('follows page redirect after login', async ({ page }) => {
	await page.goto('/user/login?redirect=%2Fresults&reason=auth');

	await submitLogin(page);

	await expect(page).toHaveURL('/results');
});