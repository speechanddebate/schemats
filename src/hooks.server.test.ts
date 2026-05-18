import type { RequestEvent } from '@sveltejs/kit';

vi.mock('$config', () => ({
	default: {
		indexcards: {
			host: 'https://api.example.com',
			basePath: '/v1',
			authCookieName: 'Tabroom_Cookie',
			csrfCookieName: 'CSRF_Token',
			csrfTokenHeader: 'x-csrf-token',
			sessionHeader: 'tabroom-sessionkey',
		},
	},
}));

vi.mock('$indexcards/utils', () => ({
	attachCSRFToken: vi.fn(),
}));

const { logger } = vi.hoisted(() => ({
	logger: {
		error: vi.fn(),
		warn: vi.fn(),
	},
}));

vi.mock('$lib/helpers/logging/logging.server', () => ({ default: logger }));

import { handle, handleError } from './hooks.server';

const createRequestEvent = (overrides: Partial<RequestEvent>): RequestEvent => ({
	cookies: {
		get: vi.fn(),
		getAll: vi.fn().mockReturnValue([]),
		set: vi.fn(),
		delete: vi.fn(),
		serialize: vi.fn(),
	},
	fetch: vi.fn(),
	getClientAddress: vi.fn().mockReturnValue('127.0.0.1'),
	locals: {
		requestId: 'req-default',
		Session: null,
	},
	params: {},
	platform: undefined,
	request: new Request('https://schemats.test/'),
	route: { id: '/' },
	setHeaders: vi.fn(),
	url: new URL('https://schemats.test/'),
	isDataRequest: false,
	isSubRequest: false,
	tracing: undefined,
	...overrides,
}) as RequestEvent;

describe('hooks.server logging', () => {
	let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		vi.clearAllMocks();
		consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
	});

	afterEach(() => {
		consoleErrorSpy.mockRestore();
	});

	it('logs non-404 unhandled request errors with request metadata', () => {
		const error = new Error('boom');
		const event = createRequestEvent({
			locals: { requestId: 'req-123', Session: null },
			request: new Request('https://schemats.test/paradigms?tab=1', { method: 'GET' }),
			url: new URL('https://schemats.test/paradigms?tab=1'),
		});

		const result = handleError({
			error,
			event,
			status: 500,
			message: 'Internal Error',
		});

		expect(result).toEqual({
			message: 'Internal Error',
			errorId: 'req-123',
		});
		expect(logger.error).toHaveBeenCalledWith(
			'Unhandled request error',
			expect.objectContaining({
				errorId: 'req-123',
				status: 500,
				method: 'GET',
				path: '/paradigms',
				search: '?tab=1',
				error,
			})
		);
	});

	it('does not log handled 404 errors', () => {
		const event = createRequestEvent({
			locals: { requestId: 'req-404', Session: null },
			request: new Request('https://schemats.test/missing', { method: 'GET' }),
			url: new URL('https://schemats.test/missing'),
		});

		handleError({
			error: new Error('missing'),
			event,
			status: 404,
			message: 'Not found',
		});

		expect(logger.error).not.toHaveBeenCalled();
	});

	it('logs session bootstrap fetch failures', async () => {
		const cookies = {
			get: vi.fn((name: string) => (name === 'Tabroom_Cookie' ? 'session-123' : undefined)),
			getAll: vi.fn().mockReturnValue([]),
			set: vi.fn(),
			delete: vi.fn(),
			serialize: vi.fn(),
		};
		const event = createRequestEvent({
			locals: { requestId: '', Session: null },
			cookies,
			fetch: vi.fn().mockRejectedValue(new Error('session endpoint down')),
			request: new Request('https://schemats.test/paradigms', { method: 'GET' }),
			url: new URL('https://schemats.test/paradigms'),
		});
		const resolve = vi.fn().mockResolvedValue(new Response('ok'));

		await handle({ event, resolve });

		expect(resolve).toHaveBeenCalled();
		expect(logger.warn).toHaveBeenCalledWith(
			'Session bootstrap failed',
			expect.objectContaining({
				requestId: expect.any(String),
				path: '/paradigms',
				error: expect.any(Error),
			})
		);
	});
});