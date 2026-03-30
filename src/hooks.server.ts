import config from '$config';
import type { Handle, HandleFetch, HandleServerError } from '@sveltejs/kit';

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
		} catch {
			event.locals.Session = null;
		}
	}

	const response = await resolve(event);
	return response;
};

export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {
	if (request.url.startsWith(`${config.indexcards.host}${config.indexcards.basePath}`)) {
		request.headers.set('cookie', event.request.headers.get('cookie') || '');
	}
	return fetch(request);
};

export const handleError: HandleServerError = ({ error, event, status, message }) => {
	const errorId = event.locals.requestId;

	//don't log 404s, since those are expected to happen and don't indicate a problem with the server. RCT
	if (status !== 404) {
		//TODO convert to a proper logging system at some point, but for now this will do. RCT
		console.error('Unhandled request error', {
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
