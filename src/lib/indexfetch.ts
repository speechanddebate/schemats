import { createQuery } from '@tanstack/svelte-query';
import grab from 'grab-url';

interface queryOptions {
	key?             : string | number,
	queries?         : object,
	refreshInterval? : number,
	staleTime?       : number,
}

// Fetch data from Indexcards please using Tanstack Query

export const indexFetch = (url:string, options:queryOptions = {}) => {

	// Set baseURL if not already set (grab-url handles relative paths if baseURL is set)
	if (!(grab as any).defaults.baseURL) {
		(grab as any).defaults.baseURL = import.meta.env.VITE_API_URL;
	}

	const grabOptions: any = {
		...options.queries
	};

	if (options.key) {
		url += `/${options.key}`;
	}

	const query = createQuery(() => ({
		queryFn: async () => {
			try {
				// grab-url handles query params and the fetch itself
				return await grab(url, grabOptions);
			} catch (err) {
				return {error: err};
			}
		},
		queryKey        : [url, options.key, options.queries],
		refreshInterval : options.refreshInterval || 60 * 1000,
		staleTime       : options.staleTime || 60 * 1000,
	}));

	return query;
};

export default indexFetch;