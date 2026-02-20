import type { HandleFetch } from '@sveltejs/kit';
import config from '$config';

export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {
	const url = new URL(request.url);

	// Rewrite API requests to the backend server (match only if path starts with /v1)
	if (url.pathname.startsWith(config.indexcards.basePath)) {
		request = new Request(
			request.url.replace(event.url.origin, config.indexcards.host),
			request
		);
		request.headers.set('cookie', event.request.headers.get('cookie') || '');
	}

	return fetch(request);
};
