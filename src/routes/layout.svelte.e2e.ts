import { test, expect } from '../../config/testing/playwright.setup';
import { getRestTournsMockHandler } from '../indexcards/index.msw';
test('has expected login button and navigates to login page', async ({ page }) => {
	await page.goto('/');
	const loginButton = page.getByRole('link', { name: /login/i });
	await expect(loginButton).toBeVisible();
	await expect(page.getByText('Sign Up')).toBeVisible();

	await loginButton.click();
	await expect(page).toHaveURL(/\/user\/login(\?|$)/);
	await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
});
test.fixme('has expected signup button and navigates to signup page', async ({ page }) => {
	await page.goto('/');
	const signupButton = page.getByRole('link', { name: /sign up/i });
	await expect(signupButton).toBeVisible();
	await expect(page.getByText('Login')).toBeVisible();

	await signupButton.click();
	await expect(page).toHaveURL(/\/user\/register(\?|$)/);
	await expect(page.getByRole('heading', { name: /sign up/i })).toBeVisible();
});
test('renders the list of tournaments with page-specific MSW endpoint override', async ({ page, network }) => {
	network.use(
		getRestTournsMockHandler([
			{
				id: 4242,
				name: 'Copilot Invitational',
				city: 'Austin',
				state: 'TX',
				country: 'US',
				tz: 'America/Chicago',
				webname: 'copilot-invitational',
				start: '2026-04-01T12:00:00.000Z',
				end: '2026-04-03T20:00:00.000Z',
			},
		]),
	);

	await page.goto('/results');
	await expect(page.getByText('Copilot Invitational')).toBeVisible();
});