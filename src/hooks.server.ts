import type { HandleFetch, HandleServerError } from '@sveltejs/kit';

export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {
	if (request.url.startsWith('import.meta.env.VITE_API_URL')) {
		request.headers.set('cookie', event.request.headers.get('cookie') || '');
	}
	return fetch(request);
};

export const handleError: HandleServerError = ({ error, event, status, message }) => {
	const errorId = crypto.randomUUID();

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
