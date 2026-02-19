import type { HandleFetch } from '@sveltejs/kit';
import config from '$config';

export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {
	if (request.url.startsWith(config.indexcards.basePath)) {
		request.headers.set('cookie', event.request.headers.get('cookie'));
	}
	return fetch(request);
};
