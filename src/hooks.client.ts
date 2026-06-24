// src/hooks.client.ts

import type { ClientInit, HandleClientError } from '@sveltejs/kit';
import  {
	INDEXCARDS_HOST,
	INDEXCARDS_CLIENT_HOST,
	CSRF_COOKIE_NAME,
	CSRF_HEADER_NAME,
} from '$app/env/public';
import { attachCSRFToken } from '$indexcards/utils';
import { clientLogger } from '$lib/helpers/logging/logging';

export const handleError: HandleClientError = ({ error, event, status, message }): App.Error => {
	// log the error to our server log endpoint RCT
	clientLogger.error(message, {
		error,
		status,
		path: event?.url.pathname ?? null,
		source: 'handleError',
	});
	return {
		message,
		errorId: 'client-error',
	};
};

export const init: ClientInit = async () => {
	// log unhandled errors and rejections to our server log endpoint RCT
	window.addEventListener('error', (ev: ErrorEvent) => {
		const message = ev.message ?? 'Unhandled error';
		clientLogger.error(message, {
			error: ev.error ?? ev,
			kind: 'error',
			path: window.location.pathname,
			source: 'window.error',
		});
	});

	window.addEventListener('unhandledrejection', (ev: PromiseRejectionEvent) => {
		const message = ev.reason instanceof Error ? ev.reason.message
			: typeof ev.reason === 'string' ? ev.reason
			: 'Unhandled promise rejection';
		clientLogger.error(message, {
			error: ev.reason,
			kind: 'unhandledrejection',
			path: window.location.pathname,
			source: 'window.unhandledrejection',
		});
	});
	/**
	 *  patch the global fetch function to automatically attach the CSRF token for mutating requests to indexcards RCT
	 */
	const nativeFetch = window.fetch;
	window.fetch = (input, options = {}) => {
		let url = '';
		let method = 'GET';
		if (typeof input === 'string') {
			url = input;
			method = (options.method || 'GET').toUpperCase();
		} else if (input instanceof Request) {
			url = input.url;
			method = (options.method || input.method || 'GET').toUpperCase();
		}

		if (url.startsWith(INDEXCARDS_CLIENT_HOST ? INDEXCARDS_CLIENT_HOST : INDEXCARDS_HOST)) {
			const headers = new Headers((options && options.headers) || (input instanceof Request ? input.headers : {}));
			attachCSRFToken(headers, method, () => getCookieValue(CSRF_COOKIE_NAME), CSRF_HEADER_NAME);
			options.headers = headers;
		}
		return nativeFetch(input, options);
	};
};
/**
 *  Extract a cookie value by name from document.cookie.
 * @param name the name of the cookie to extract
 * @returns the cookie value, or undefined if the cookie is not found or malformed
 */
export const getCookieValue = (name: string): string | undefined => {
	if (typeof document !== 'undefined') {
		const cookie = document.cookie
		.split('; ')
		.find((row) => row.startsWith(`${name}=`));
		if (!cookie) {
			return undefined;
		}
		const value = cookie.split('=')[1];
		if (!value) {
			clientLogger.warn(`cookie "${name}" was malformed in document.cookie`);
			return undefined;
		}
		return decodeURIComponent(value);
	}
	clientLogger.warn(`document is undefined, cannot read cookie "${name}"`);
	return undefined;
};

