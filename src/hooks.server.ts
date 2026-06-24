import {
	INDEXCARDS_HOST,
	INDEXCARDS_BASE_PATH,
	CSRF_COOKIE_NAME,
	CSRF_HEADER_NAME,
} from '$app/env/public';
import {
	AUTH_COOKIE,
} from '$app/env/private';
import type { Handle, HandleFetch, HandleServerError } from '@sveltejs/kit';
import { attachCSRFToken } from '$indexcards/utils';
import logger from '$lib/helpers/logging/logging.server';
import { userSession } from '$indexcards';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.requestId = crypto.randomUUID();
	const sessionId = event.cookies.get(AUTH_COOKIE);
	event.locals.Session = null;

	if (sessionId) {
		try {
			const res = await userSession({
				credentials: 'include',
				headers: {
					cookie: `${AUTH_COOKIE}=${sessionId}`,
				},
			}, event.fetch);

			if (res.status === 200) {
				event.locals.Session = res.data;
			}
			else if (res.status !== 401){
				logger.warn('Session bootstrap failed', {
					requestId: event.locals.requestId,
					path: event.url.pathname,
					error: res.data,
				});
			}
		} catch (error) {
			logger.warn('Session bootstrap failed', {
				requestId: event.locals.requestId,
				path: event.url.pathname,
				error,
			});
		}
	}
	const response = await resolve(event);
	return response;
};

export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {
	if (request.url.startsWith(`${INDEXCARDS_HOST}${INDEXCARDS_BASE_PATH}`)) {
		// forward the auth cookie as a header for API requests.
		// This is kind of a hack as svelte wont forward the cookie for sister-origin requests, but our API is on a different
		// subdomain so it is technically a cross-origin request. RCT
		request.headers.set('cookie', event.request.headers.get('cookie') || '');
		// attach CSRF token for mutating requests
		const csrfCookie = event.cookies.get(CSRF_COOKIE_NAME);
		attachCSRFToken(request.headers, request.method, () => csrfCookie, CSRF_HEADER_NAME);
	}
	return fetch(request);
};

export const handleError: HandleServerError = ({ error, event, status, message }): App.Error => {
	const errorId = event.locals.requestId;

	//don't log 404s, since those are expected to happen and don't indicate a problem with the server. RCT
	if (status !== 404) {
		logger.error('Unhandled request error', {
			errorId,
			status,
			method: event.request.method,
			path: event.url.pathname,
			search: event.url.search,
			error,
		});
	}

	return {
		message,
		errorId,
	};
};
