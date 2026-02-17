
import { createQuery } from '@tanstack/svelte-query';
import type { CreateQueryResult } from '@tanstack/svelte-query';
import type { Problem } from '$lib/types/Problem';

interface queryOptions {
	key?             : string | number,
	queries?         : object,
	refreshInterval? : number,
}

const parseProblem = async (response: Response): Promise<Problem> => {
	const contentType = response.headers.get('content-type') || '';

	if (contentType.includes('application/problem+json') || contentType.includes('application/json')) {
		try {
			const data = await response.json() as Problem;
			return {
				status : response.status,
				title  : data.title || response.statusText,
				...data,
			};
		} catch {
			// Fall through to a generic problem object.
		}
	}

	return {
		type     : 'about:blank',
		title    : response.statusText || 'Request failed',
		status   : response.status,
		detail   : response.statusText || 'Request failed',
		instance : response.url,
	};
};

//TODO: this any should eventually be unknown but we don't have all the types defined yet RCT
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const indexFetch = <T = any>
	(url:string, options:queryOptions = {}): CreateQueryResult<T, Problem> => {

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

			// 'Iterating over object keys in TypeScript can be a nightmare'. Yeah no shit. CLP
			queryUrl += `${parameter}=${options.queries[parameter as keyof typeof options.queries]}`;
		}
		notFirst = true;
	}

	const query = createQuery<T, Problem>(() => ({
		queryFn: async () => {
			const response = await fetch(
				queryUrl,
				{ credentials: 'include' }
			);

			if (!response.ok) {
				throw await parseProblem(response);
			}

			return response.json() as Promise<T>;
		},
		queryKey: [queryUrl],
		refreshInterval : options.refreshInterval || 15000,
	}));

	return query;
};

export default indexFetch;