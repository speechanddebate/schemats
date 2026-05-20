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

const {
	mockClientLoggerError,
	mockClientLoggerWarn,
	mockClientLoggerInfo,
	mockClientLoggerDebug,
} = vi.hoisted(() => ({
	mockClientLoggerError: vi.fn(),
	mockClientLoggerWarn: vi.fn(),
	mockClientLoggerInfo: vi.fn(),
	mockClientLoggerDebug: vi.fn(),
}));

vi.mock('$lib/helpers/logging/logging', async () => {
	const actual = await vi.importActual<typeof import('$lib/helpers/logging/logging')>(
		'$lib/helpers/logging/logging',
	);

	return {
		...actual,
		clientLogger: {
			error: mockClientLoggerError,
			warn: mockClientLoggerWarn,
			info: mockClientLoggerInfo,
			debug: mockClientLoggerDebug,
		},
	};
});

import * as hooksClient from './hooks.client';

const { init } = hooksClient;

const CSRF_COOKIE_VALUE = 'test-csrf-token-abc123';
const OTHER_HOST = 'https://other.example.com';
const API_HOST = 'https://api.example.com';
const MUTATING_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'] as const;

describe('handleClientError', () => {
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

		expect(mockClientLoggerError).toHaveBeenCalledWith(
			'Internal Error',
			expect.objectContaining({
				error: expect.any(Error),
				status: 500,
				path: '/paradigms',
				source: 'handleError',
			}),
		);
	});
});

describe('Client Init', () => {
	describe('CSRF token injection', () => {
		beforeEach(async () => {
			mockFetch.mockResolvedValue(new Response('ok'));
			mockClientLoggerError.mockReset();
			mockClientLoggerWarn.mockReset();
			mockClientLoggerInfo.mockReset();
			mockClientLoggerDebug.mockReset();

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

			it('logs a warning for a malformed cookie value', async () => {
				Object.defineProperty(document, 'cookie', {
					configurable: true,
					get: () => `csrf_token=; other_cookie=foo`,
				});

				mockFetch.mockClear();

				await window.fetch(`${API_HOST}/resource`, { method: 'POST' });

				const [, options] = mockFetch.mock.calls[0];
				const headers = new Headers(options?.headers ?? {});
				expect(headers.get('x-csrf-token')).toBeNull();
				expect(mockClientLoggerWarn).toHaveBeenCalledWith(
					expect.stringContaining('cookie "csrf_token" was malformed'),
				);
			});

			it('logs a warning when document is undefined', async () => {
				const originalDocument = global.document;
				try {
					Object.defineProperty(global, 'document', {
						configurable: true,
						value: undefined,
					});

					mockFetch.mockClear();

					await window.fetch(`${API_HOST}/resource`, { method: 'POST' });

					const [, options] = mockFetch.mock.calls[0];
					const headers = new Headers(options?.headers ?? {});
					expect(headers.get('x-csrf-token')).toBeNull();
					expect(mockClientLoggerWarn).toHaveBeenCalledWith(
						expect.stringContaining('document is undefined'),
					);
				} finally {
					Object.defineProperty(global, 'document', {
						configurable: true,
						value: originalDocument,
					});
				}
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
					get: () => '',
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
	});
	describe('global error handling', () => {
		beforeEach(() => {
			mockClientLoggerError.mockReset();
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

			expect(mockClientLoggerError).toHaveBeenCalledWith(
				'uncaught browser error',
				expect.objectContaining({
					error: expect.any(Error),
					kind: 'error',
					source: 'window.error',
				}),
			);
		});

		it('posts unhandled promise rejections to the server log endpoint', async () => {
			await init();

			const event = new Event('unhandledrejection');
			Object.defineProperty(event, 'reason', {
				configurable: true,
				value: new Error('async failure'),
			});

			window.dispatchEvent(event);

			expect(mockClientLoggerError).toHaveBeenCalledWith(
				'async failure',
				expect.objectContaining({
					error: expect.any(Error),
					kind: 'unhandledrejection',
					source: 'window.unhandledrejection',
				}),
			);
		});
	});
});

describe('getCookieValue', () => {
	it('extracts the value of a cookie by name', () => {
		Object.defineProperty(document, 'cookie', {
			configurable: true,
			get: () => 'foo=bar; test_cookie=abc123; hello=world',
		});

		expect(hooksClient.getCookieValue('test_cookie')).toBe('abc123');
		expect(hooksClient.getCookieValue('foo')).toBe('bar');
		expect(hooksClient.getCookieValue('hello')).toBe('world');
		expect(hooksClient.getCookieValue('nonexistent')).toBeUndefined();
	});
	it('returns undefined and logs warning if the cookie is malformed', () => {
		Object.defineProperty(document, 'cookie', {
			configurable: true,
			get: () => 'foo=bar; malformed_cookie=; hello=world',
		});

		expect(hooksClient.getCookieValue('malformed_cookie')).toBeUndefined();
		expect(mockClientLoggerWarn).toHaveBeenCalledWith(
			expect.stringContaining('cookie "malformed_cookie" was malformed'),
		);
	});
	it('returns undefined and logs warning if document is undefined', () => {
		const originalDocument = global.document;
		try {
			Object.defineProperty(global, 'document', {
				configurable: true,
				value: undefined,
			});

			expect(hooksClient.getCookieValue('any_cookie')).toBeUndefined();
			expect(mockClientLoggerWarn).toHaveBeenCalledWith(
				expect.stringContaining('document is undefined'),
			);
		} finally {
			Object.defineProperty(global, 'document', {
				configurable: true,
				value: originalDocument,
			});
		}
	});
});