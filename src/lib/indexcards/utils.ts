/**
 * Utility functions for Orval-generated API client and functions related to interacting with the IndexCards API
 */

import config from '$config';

/** Helper function to attach CSRF token to request headers for mutating requests (POST, PUT, PATCH, DELETE).
 * used in both client and server hooks to ensure CSRF token is included for relevant requests to the IndexCards API. RCT
 */
export function attachCSRFToken(headers: Headers, method: string, getToken: () => string | undefined) {
	const mutationMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
	if (mutationMethods.includes(method)) {
		const token = getToken();
		if (token && !headers.has(config.indexcards.csrfTokenHeader)) {
			headers.set(config.indexcards.csrfTokenHeader, token);
		}
	}
}
