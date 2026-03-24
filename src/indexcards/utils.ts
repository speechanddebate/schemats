/**
 * Utility functions for Orval-generated API client
 */

import type { Problem } from '$indexcards/schemas/problem';

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

/**
 * Add CSRF token header to requests if token exists and method is not GET/HEAD
 */
const applyCSRFToken = (headers: Headers, method: string): void => {
	const csrfToken = getCookieValue('CSRF_Token');
	if (csrfToken && method !== 'GET' && method !== 'HEAD') {
		headers.set('x-csrf-token', csrfToken);
	}
};

/**
 * Parse error response as Problem (RFC 7807 format)
 */
const parseProblem = async (response: Response): Promise<Problem> => {
	const contentType = response.headers.get('content-type') || '';

	if (contentType.includes('application/problem+json') || contentType.includes('application/json')) {
		try {
			return await response.json() as Problem;
		} catch {
			// Fall through to a generic problem object.
		}
	}

	return {
		type: 'about:blank',
		title: response.statusText || 'Request failed',
		status: response.status,
		detail: response.statusText || 'Request failed',
		instance: response.url,
	};
};

/**
 * Orval mutator: Handles CSRF tokens, credentials, and response parsing
 * Referenced in config/orval.config.ts
 */
export const orvalMutator = async <T>(
	url: string,
	init: RequestInit = {}
): Promise<T> => {
	const method = (init.method ?? 'GET').toUpperCase();
	const headers = new Headers(init.headers ?? {});

	applyCSRFToken(headers, method);

	return orvalFetch(url, fetch, { ...init, method, headers });
};

/** Scrappy fix for making fetch functions to match orval-generated types, I have an open feature request
 * to fix orval prefetch generation for svelte-query orval-labs/orval #3119 but may keep as a helper even
 * if that is fixed. RCT
 */
export const orvalFetch = async <T>(
	url: string,
	fetchClient: (_url: string, _init?: RequestInit) => Promise<Response>,
	init: RequestInit = {}
): Promise<T> => {
	const response = await fetchClient(url, init);

	if (!response.ok) {
		throw await parseProblem(response);
	}

	// Handle empty responses (e.g., 204 No Content or endpoints that don't return a body)
	const contentType = response.headers.get('content-type');
	if (!contentType?.includes('application/json') || response.status === 204) {
		return { data: undefined, status: response.status, headers: response.headers } as T;
	}

	const data = await response.json();

	// Wrap response to match orval-generated types: { data, status, headers }
	return { data, status: response.status, headers: response.headers } as T;
};
