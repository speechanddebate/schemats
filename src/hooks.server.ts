import config from '$config';
import type { Handle, HandleFetch, HandleServerError } from '@sveltejs/kit';
import { attachCSRFToken } from '$indexcards/utils';
import logger from '$lib/helpers/logging/logging.server';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.requestId = crypto.randomUUID();
	const sessionId = event.cookies.get(config.indexcards.authCookieName);
	event.locals.Session = null;

	if (sessionId) {
		try {
			const apiResponse = await event.fetch(`${config.indexcards.host}${config.indexcards.basePath}/user/session`, {
				credentials: 'include',
				headers: {
					[config.indexcards.sessionHeader]: sessionId,
				},
			});

			if (apiResponse.ok && apiResponse.status !== 401) {
				const sessionData = await apiResponse.json();
				event.locals.Session = sessionData;
			}
		} catch (err) {
			event.locals.Session = null;
			logger.warn('Session bootstrap failed', {
				requestId: event.locals.requestId,
				path: event.url.pathname,
				error: err,
			});
		}
	}

	const response = await resolve(event);
	return response;
};

export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {

	if (request.url.startsWith(`${config.indexcards.host}${config.indexcards.basePath}`)) {
		// forward the auth cookie as a header for API requests.
		// This is kind of a hack as svelte wont forward the cookie for sister-origin requests, but our API is on a different
		// subdomain so it is technically a cross-origin request. RCT
		request.headers.set('cookie', event.request.headers.get('cookie') || '');
		// attach CSRF token for mutating requests
		const csrfCookie = event.cookies.get(config.indexcards.csrfCookieName);
		attachCSRFToken(request.headers, request.method, () => csrfCookie);
	}

	return fetch(request);
};

export const handleError: HandleServerError = ({ error, event, status, message }) => {
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
