import { APP_CONFIG } from '$config';
/**
 *  handles loading and attaching session data to the root layout, so it can be accessed by all child routes.
 * This should be in a load function as it needs to be present before any page is rendered to avoid a flash of unauthenticated content,
 * and it needs to run on the server to access cookies securely.
 */
export async function load({ cookies, fetch }) {
	const sessionId = cookies.get(APP_CONFIG.AUTH_COOKIE_NAME);

	if (!sessionId) {
		return { isLoggedIn: false };
	}

	try {
		const response = await fetch(`${import.meta.env.VITE_API_URL}/user/session`, {
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
