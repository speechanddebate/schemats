import { redirect } from '@sveltejs/kit';
import { getRequestEvent } from '$app/server';
/**
 *  Verifies that there is a valid session in the request. If not, redirects to the login page with a redirect query parameter.
 * @returns the session object if it exists, otherwise it will redirect to the login page.
 */
export function requireLogin() {
	const { locals, url } = getRequestEvent();

	if (!locals.Session) {
		const redirectTo = url.pathname + url.search;
		const params = new URLSearchParams({
			redirect: redirectTo,
			reason: 'auth',
		});

		redirect(303, `/user/login?${params}`);
	}

	return locals.Session;
}