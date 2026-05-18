// src/hooks.client.ts

import type { ClientInit, HandleClientError } from '@sveltejs/kit';
import config from '$config';
import { attachCSRFToken } from '$indexcards/utils';
import { buildClientLogPayload, postClientLog } from '$lib/helpers/logging/logging';

export const handleError: HandleClientError = ({ error, event, status, message }) => {
	// log the error to our server log endpoint RCT
	postClientLog(
		buildClientLogPayload('error', message, error, {
			status,
			path: event?.url.pathname ?? null,
			source: 'handleError',
		})
	);
};

export const init: ClientInit = async () => {
	// log unhandled errors and rejections to our server log endpoint RCT
	window.addEventListener('error', (ev) => {
		const errorEvent = ev as unknown as { message?: string; error?: unknown };
		const message = errorEvent.message ?? String(ev);
		postClientLog(
			buildClientLogPayload('error', message, errorEvent.error ?? ev, {
				kind: 'error',
				path: window.location.pathname,
				source: 'window.error',
			})
		);
	});

	window.addEventListener('unhandledrejection', (ev) => {
		const reason = (ev as unknown as { reason?: unknown }).reason;
		const message = reason instanceof Error ? reason.message : String(reason);
		postClientLog(
			buildClientLogPayload('error', message, reason, {
				kind: 'unhandledrejection',
				path: window.location.pathname,
				source: 'window.unhandledrejection',
			})
		);
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

		if (url.startsWith(config.indexcards.clientHost)) {
			const headers = new Headers((options && options.headers) || (input instanceof Request ? input.headers : {}));
			attachCSRFToken(headers, method, () => getCookieValue(config.indexcards.csrfCookieName));
			options.headers = headers;
		}
		return nativeFetch(input, options);
	};
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

