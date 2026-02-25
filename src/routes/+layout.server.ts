import config from '$config';
/**
 *  handles loading and attaching session data to the root layout, so it can be accessed by all child routes.
 * This should be in a load function as it needs to be present before any page is rendered to avoid a flash of unauthenticated content,
 * and it needs to run on the server to access cookies securely.
 */
export async function load({ cookies, fetch }) {
	const sessionId = cookies.get(config.indexcards.authCookieName);
	if (!sessionId) {
		return { isLoggedIn: false };
	}

	try {
		const response = await fetch(`${config.indexcards.basePath}/user/session`, {
			credentials: 'include',
		});

		if (response.status === 401) {
			// Cookie was invalid, return unauthenticated state
			return { isLoggedIn: false };
		}

		const sessionData = await response.json();
		return { isLoggedIn: true, sessionData };
	} catch {
		return { isLoggedIn: false };
	}
}
