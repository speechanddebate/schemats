import type { HandleFetch } from '@sveltejs/kit';

export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {
	if (request.url.startsWith('import.meta.env.VITE_API_URL')) {
		request.headers.set('cookie', event.request.headers.get('cookie'));
	}
	return fetch(request);
};
