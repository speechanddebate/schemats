import config from '$config';
import type { ServerLoad } from '@sveltejs/kit';

/** handles loading and attaching session data to the root layout, so it can be
 * accessed by all child routes. This should be in a load function as it needs
 * to be present before any page is rendered to avoid a flash of
 * unauthenticated content, and it needs to run on the server to access cookies
 * securely.
 */

export const load: ServerLoad = async ({ cookies, fetch }) => {

	const sessionId = cookies.get(config.indexcards.authCookieName);
	if (!sessionId) return;

	try {

		// Turns out Svelte cannot deal with sibling-ranked subdomains and send
		// cookies, so here we just dispatch the key as a header instead.

		const response = await fetch(`${config.indexcards.basePath}/user/session`, {
			credentials : 'include',
			headers: {
				[config.indexcards.sessionHeader] : sessionId,
			},
		});

		// Cookie was invalid, return unauthenticated state
		if (response.status === 401) return;

		const sessionData = await response.json();
		return { sessionData };

	} catch {
		return;
	}
};