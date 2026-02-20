/**
 * Utility functions for Orval-generated API client
 */

import type { Problem } from '$lib/types/Problem';

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
			const data = await response.json() as Problem;
			return {
				status: response.status,
				title: data.title || response.statusText,
				...data,
			};
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

	const response = await fetch(url, {
		...init,
		method,
		headers,
	});

	if (!response.ok) {
		throw await parseProblem(response);
	}

	// Handle empty responses (e.g., 204 No Content or endpoints that don't return a body)
	const contentType = response.headers.get('content-type');
	if (!contentType?.includes('application/json') || response.status === 204) {
		return undefined as T;
	}

	return response.json();
};
