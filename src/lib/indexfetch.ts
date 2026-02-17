
import { createMutation, createQuery } from '@tanstack/svelte-query';
import type { CreateMutationResult, CreateQueryResult } from '@tanstack/svelte-query';
import type { Problem } from '$lib/types/Problem';

interface queryOptions {
	key?             : string | number,
	queries?         : object,
	refreshInterval? : number,
}

type MutationInit<TVariables> = RequestInit | ((req: TVariables) => RequestInit);

const isAbsoluteUrl = (url: string): boolean =>
	url.startsWith('http://') || url.startsWith('https://');

const buildUrl = (url: string, options: queryOptions = {}): string => {
	let queryUrl = isAbsoluteUrl(url) ? url : `${import.meta.env.VITE_API_URL}${url}`;

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
			notFirst = true;
		}
	}

	return queryUrl;
};

const getCookieValue = (name: string): string | undefined => {
	if (typeof document === 'undefined') {
		return undefined;
	}

	const cookie = document.cookie
		.split('; ')
		.find((row) => row.startsWith(`${name}=`));

	if (!cookie) {
		return undefined;
	}

	return decodeURIComponent(cookie.split('=')[1] || '');
};

export const apiFetch = (url: string, init: RequestInit = {}): Promise<Response> => {
	const method = (init.method ?? 'GET').toUpperCase();
	const headers = new Headers(init.headers ?? {});
	const csrfToken = getCookieValue('CSRF_Token');
	const requestUrl = isAbsoluteUrl(url) ? url : `${import.meta.env.VITE_API_URL}${url}`;

	if (csrfToken && method !== 'GET' && method !== 'HEAD') {
		headers.set('x-csrf-token', csrfToken);
	}

	return fetch(
		requestUrl,
		{
			...init,
			method,
			headers,
			credentials: 'include',
		}
	);
};

export const indexMutation = <TData = unknown, TVariables = void>(
	url: string,
	init: MutationInit<TVariables> = {},
	options: queryOptions = {},
): CreateMutationResult<TData, Problem, TVariables> =>
		createMutation<TData, Problem, TVariables>(() => ({
			mutationKey: [url],
			mutationFn: async (variables) => {
				const resolvedInit = typeof init === 'function' ? init(variables) : init;
				const mutationUrl = buildUrl(url, options);
				const response = await apiFetch(mutationUrl, resolvedInit);

				if (!response.ok) {
					throw await parseProblem(response);
				}

				const contentType = response.headers.get('content-type') || '';
				if (contentType.includes('application/json') || contentType.includes('application/problem+json')) {
					return response.json() as Promise<TData>;
				}

				return undefined as TData;
			},
		}));

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

	const queryUrl = buildUrl(url, options);

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