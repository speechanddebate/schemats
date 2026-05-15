// src/hooks.client.test.ts

vi.mock('$config', () => ({
	default: {
		indexcards: {
			clientHost: 'https://api.example.com',
			csrfTokenHeader: 'x-csrf-token',
			csrfCookieName: 'csrf_token',
		},
	},
}));

// vi.hoisted runs before any import is evaluated, so window.fetch is already
// the mock when hooks.client.ts executes `const nativeFetch = window.fetch`
const mockFetch = vi.hoisted(() => {
	const fn = vi.fn();
	vi.stubGlobal('fetch', fn);
	return fn;
});

import * as hooksClient from './hooks.client';

const { init } = hooksClient;

const CSRF_COOKIE_VALUE = 'test-csrf-token-abc123';
const OTHER_HOST = 'https://other.example.com';
const API_HOST = 'https://api.example.com';
const MUTATING_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'] as const;

describe('hooks.client - CSRF token injection', () => {
	beforeEach(async () => {
		mockFetch.mockResolvedValue(new Response('ok'));

		Object.defineProperty(document, 'cookie', {
			configurable: true,
			get: () => `csrf_token=${CSRF_COOKIE_VALUE}; other_cookie=foo`,
		});

		await init();
	});

	afterEach(() => {
		mockFetch.mockReset();
	});

	describe('string URL input', () => {
		it.each(MUTATING_METHODS)(
			'attaches the CSRF token header for %s requests to the API host',
			async (method) => {
				await window.fetch(`${API_HOST}/resource`, { method });

				const [, options] = mockFetch.mock.calls[0];
				const headers = new Headers(options.headers);
				expect(headers.get('x-csrf-token')).toBe(CSRF_COOKIE_VALUE);
			}
		);

		it('does NOT attach the CSRF token for GET requests', async () => {
			await window.fetch(`${API_HOST}/resource`, { method: 'GET' });

			const [, options] = mockFetch.mock.calls[0];
			const headers = new Headers(options?.headers ?? {});
			expect(headers.get('x-csrf-token')).toBeNull();
		});

		it('does NOT attach the CSRF token for requests to a different host', async () => {
			await window.fetch(`${OTHER_HOST}/resource`, { method: 'POST' });

			const [, options] = mockFetch.mock.calls[0];
			const headers = new Headers(options?.headers ?? {});
			expect(headers.get('x-csrf-token')).toBeNull();
		});

		it('does NOT overwrite an existing CSRF token header', async () => {
			await window.fetch(`${API_HOST}/resource`, {
				method: 'POST',
				headers: { 'x-csrf-token': 'already-set' },
			});

			const [, options] = mockFetch.mock.calls[0];
			const headers = new Headers(options.headers);
			expect(headers.get('x-csrf-token')).toBe('already-set');
		});
	});

	describe('Request object input', () => {
		it('attaches the CSRF token when given a POST Request object', async () => {
			const request = new Request(`${API_HOST}/resource`, { method: 'POST' });
			await window.fetch(request);

			const [, options] = mockFetch.mock.calls[0];
			const headers = new Headers(options.headers);
			expect(headers.get('x-csrf-token')).toBe(CSRF_COOKIE_VALUE);
		});

		it('respects the method override in options when given a Request object', async () => {
			// Request defaults to GET but options overrides to POST
			const request = new Request(`${API_HOST}/resource`);
			await window.fetch(request, { method: 'POST' });

			const [, options] = mockFetch.mock.calls[0];
			const headers = new Headers(options.headers);
			expect(headers.get('x-csrf-token')).toBe(CSRF_COOKIE_VALUE);
		});

		it('does NOT overwrite an existing CSRF token on a Request object', async () => {
			const request = new Request(`${API_HOST}/resource`, {
				method: 'DELETE',
				headers: { 'x-csrf-token': 'already-set' },
			});
			await window.fetch(request);

			const [, options] = mockFetch.mock.calls[0];
			const headers = new Headers(options.headers);
			expect(headers.get('x-csrf-token')).toBe('already-set');
		});
	});

	describe('missing CSRF cookie', () => {
		beforeEach(() => {
			Object.defineProperty(document, 'cookie', {
				configurable: true,
				get: () => '', // No cookies at all
			});
		});

		it('does not set the header when the CSRF cookie is absent', async () => {
			await window.fetch(`${API_HOST}/resource`, { method: 'POST' });

			const [, options] = mockFetch.mock.calls[0];
			const headers = new Headers(options?.headers ?? {});
			expect(headers.get('x-csrf-token')).toBeNull();
		});
	});

	describe('passthrough behaviour', () => {
		it('forwards the original input and options to native fetch', async () => {
			const body = JSON.stringify({ foo: 'bar' });
			await window.fetch(`${API_HOST}/resource`, {
				method: 'POST',
				body,
				headers: { 'content-type': 'application/json' },
			});

			const [calledInput, calledOptions] = mockFetch.mock.calls[0];
			expect(calledInput).toBe(`${API_HOST}/resource`);
			expect(new Headers(calledOptions.headers).get('content-type')).toBe('application/json');
			expect(calledOptions.body).toBe(body);
		});
	});

	describe('client error logging', () => {
		it('posts SvelteKit client hook errors caught by handleError to the server log endpoint', async () => {
			const handleError = (hooksClient as Record<string, unknown>).handleError as
				| ((input: {
						error: unknown;
						event: { url: URL } | null;
						status: number;
						message: string;
					}) => unknown)
				| undefined;

			expect(typeof handleError).toBe('function');
			if (!handleError) {
				return;
			}

			await handleError({
				error: new Error('svelte blew up'),
				event: { url: new URL('https://schemats.test/paradigms') },
				status: 500,
				message: 'Internal Error',
			});

			expect(mockFetch).toHaveBeenCalledWith(
				'/log',
				expect.objectContaining({
					method: 'POST',
					keepalive: true,
				})
			);

			const [, options] = mockFetch.mock.calls.at(-1) ?? [];
			expect(JSON.parse(String(options.body))).toEqual(expect.objectContaining({
				level: 'error',
				message: 'Internal Error',
				error: expect.objectContaining({
					message: 'svelte blew up',
				}),
				context: expect.objectContaining({
					status: 500,
					path: '/paradigms',
					source: 'handleError',
				}),
			}));
		});

		it('posts uncaught browser errors to the server log endpoint', async () => {
			await init();

			const event = new Event('error');
			Object.defineProperties(event, {
				message: {
					configurable: true,
					value: 'uncaught browser error',
				},
				error: {
					configurable: true,
					value: new Error('uncaught browser error'),
				},
			});

			window.dispatchEvent(event);

			expect(mockFetch).toHaveBeenCalledWith(
				'/log',
				expect.objectContaining({
					method: 'POST',
					keepalive: true,
				})
			);

			const [, options] = mockFetch.mock.calls.at(-1) ?? [];
			expect(JSON.parse(String(options.body))).toEqual(expect.objectContaining({
				level: 'error',
				message: 'uncaught browser error',
				context: expect.objectContaining({
					kind: 'error',
					source: 'window.error',
				}),
			}));
		});

		it('posts unhandled promise rejections to the server log endpoint', async () => {
			await init();

			const event = new Event('unhandledrejection');
			Object.defineProperty(event, 'reason', {
				configurable: true,
				value: new Error('async failure'),
			});

			window.dispatchEvent(event);

			expect(mockFetch).toHaveBeenCalledWith(
				'/log',
				expect.objectContaining({
					method: 'POST',
					keepalive: true,
				})
			);

			const [, options] = mockFetch.mock.calls.at(-1) ?? [];
			expect(JSON.parse(String(options.body))).toEqual(expect.objectContaining({
				level: 'error',
				message: 'async failure',
				context: expect.objectContaining({
					kind: 'unhandledrejection',
					source: 'window.unhandledrejection',
				}),
			}));
		});
	});
});