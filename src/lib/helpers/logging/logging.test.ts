import {
	buildClientLogPayload,
	clientLogger,
	postClientLog,
	type ClientLogPayload,
} from './logging';

describe('buildClientLogPayload', () => {
	it('builds a payload with level, message, error, and context', () => {
		const error = new Error('boom');
		const payload = buildClientLogPayload('error', 'Something failed', error, { feature: 'auth' });

		expect(payload).toEqual({
			level: 'error',
			message: 'Something failed',
			error: {
				message: 'boom',
				stack: expect.any(String),
			},
			context: { feature: 'auth' },
		});
	});

	it('stringifies non-Error values in the error field', () => {
		const payload = buildClientLogPayload('warn', 'Warning', 'plain failure');

		expect(payload.error).toEqual({
			message: 'plain failure',
			stack: undefined,
		});
	});
});

describe('postClientLog', () => {
	beforeEach(() => {
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('posts payloads to /log with expected fetch options', () => {
		const mockFetch = vi.fn();
		vi.stubGlobal('window', { fetch: mockFetch } as unknown as Window & typeof globalThis);

		const payload: ClientLogPayload = {
			level: 'info',
			message: 'hello',
		};

		postClientLog(payload);

		expect(mockFetch).toHaveBeenCalledWith('/log', {
			method: 'POST',
			keepalive: true,
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(payload),
		});
	});

	it('does not throw when fetch throws', () => {
		const mockFetch = vi.fn().mockImplementation(() => {
			throw new Error('network down');
		});
		vi.stubGlobal('window', { fetch: mockFetch } as unknown as Window & typeof globalThis);

		expect(() => postClientLog({ level: 'debug', message: 'test' })).not.toThrow();
	});
});

describe('clientLogger', () => {
	beforeEach(() => {
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('forwards level, message, error, and context for error logs', () => {
		const mockFetch = vi.fn();
		vi.stubGlobal('window', { fetch: mockFetch } as unknown as Window & typeof globalThis);

		clientLogger.error('Failed to save', {
			error: new Error('db unavailable'),
			path: '/ballots',
			source: 'handleError',
		});

		const [, requestInit] = mockFetch.mock.calls[0] as [string, RequestInit];
		const body = JSON.parse(String(requestInit.body));

		expect(body).toMatchObject({
			level: 'error',
			message: 'Failed to save',
			error: {
				message: 'db unavailable',
			},
			context: {
				path: '/ballots',
				source: 'handleError',
			},
		});
	});

	it('omits context when no metadata is provided', () => {
		const mockFetch = vi.fn();
		vi.stubGlobal('window', { fetch: mockFetch } as unknown as Window & typeof globalThis);

		clientLogger.info('Hello world');

		const [, requestInit] = mockFetch.mock.calls[0] as [string, RequestInit];
		const body = JSON.parse(String(requestInit.body));

		expect(body.level).toBe('info');
		expect(body.message).toBe('Hello world');
		expect(body.context).toBeUndefined();
	});
});
