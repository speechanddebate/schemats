import config from '$config';
import { error } from '@sveltejs/kit';
import type { Problem } from '$indexcards/schemas/problem';

interface tournPathParams {
	tourn: string,
}

export const load = async ({ params, fetch }: { params: tournPathParams, fetch: typeof fetch }) => {
	const queryUrl = `${config.indexcards.basePath}/pages/invite/webname/${params.tourn}`;

	try {
		const response = await fetch(queryUrl, { credentials: 'include' });

		if (!response.ok) {
			// Try to parse the Problem response from the API
			let problem: Problem | undefined;
			try {
				const contentType = response.headers.get('content-type');
				if (contentType?.includes('application+problem/json')) {
					problem = await response.json() as Problem;
				}
			} catch {
				// Failed to parse problem, continue without it
			}

			throw error(response.status, {
				message: response.json(),
				problem,
			});
		}

		const data = await response.json();
		return data;
	} catch (err) {
		// If it's already a SvelteKit error, rethrow it
		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}
		// Otherwise, throw a 500 error
		throw error(500, {
			message: 'Failed to load tournament data',
		});
	}
};