
// A simple wrapper because TanStack can't handle an undefined return from
// fetch for some stupid reason.

// Please save me from developers with Opinions™

import { createQuery } from '@tanstack/svelte-query';

interface queryOptions {
	key?             : string | number,
	queries?         : object,
	refreshInterval? : number,
}

export const indexFetch = (url:string, options:queryOptions = {}) => {

	let queryUrl = `${import.meta.env.VITE_API_URL}${url}`;

	if (options.key) {
		queryUrl += `/${options.key}`;
	}

	if (options.queries) {
		let notFirst = false;
		queryUrl += '?';
		for (const parameter in options.queries) {
			if (notFirst) {
				queryUrl += '&';
			}
			queryUrl += `${parameter}=${options.queries[parameter]}`;
		}
		notFirst = true;
	}

	console.log(`query URL ended up being ${queryUrl}`);

	const query = createQuery(() => ({
		queryFn: async () => {
			try {
				const response = await fetch(
					queryUrl,
					{ credentials: 'include' }
				);
				return response.json();
			} catch (err) {
				return {error: err};
			}
		},
		queryKey: [queryUrl],
		refreshInterval : options.refreshInterval || 15000,
	}));

	return query;
};

export default indexFetch;