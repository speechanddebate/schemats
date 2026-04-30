// src/hooks.client.ts

import type { ClientInit } from '@sveltejs/kit';
import config from '$config';
import { attachCSRFToken } from '$indexcards/utils';

/**
 *  patch the global fetch function to automatically attach the CSRF token for mutating requests to indexcards RCT
 */
export const init: ClientInit = async () => {
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

