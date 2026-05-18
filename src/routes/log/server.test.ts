import { POST } from './+server';
import * as loggingModule from '$lib/helpers/logging/logging.server';

vi.mock('$lib/helpers/logging/logging.server', () => ({
	default: {
		error: vi.fn(),
		warn: vi.fn(),
		info: vi.fn(),
		debug: vi.fn(),
	},
}));

const postWithRequest = async (request: Request) => {
	return POST({ request } as unknown as Parameters<typeof POST>[0]);
};

describe('POST /log', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should log valid error payload', async () => {
		const logger = loggingModule.default;
		const request = new Request('http://localhost/log', {
			method: 'POST',
			body: JSON.stringify({
				level: 'error',
				message: 'Client error occurred',
				error: {
					message: 'Something went wrong',
					stack: 'Error: Something went wrong\n    at ...',
				},
				context: { page: '/app' },
			}),
		});

		const response = await postWithRequest(request);

		expect(response.status).toBe(200);
		expect(logger.error).toHaveBeenCalledWith('Client error', expect.objectContaining({
			message: 'Client error occurred',
			errorStack: 'Error: Something went wrong\n    at ...',
			page: '/app',
		}));
	});

	it('should reject payload missing level', async () => {
		const request = new Request('http://localhost/log', {
			method: 'POST',
			body: JSON.stringify({
				message: 'No level provided',
			}),
		});

		const response = await postWithRequest(request);

		expect(response.status).toBe(400);
		const data = await response.json();
		expect(data.error).toContain('Missing level or message');
	});

	it('should reject payload missing message', async () => {
		const request = new Request('http://localhost/log', {
			method: 'POST',
			body: JSON.stringify({
				level: 'error',
			}),
		});

		const response = await postWithRequest(request);

		expect(response.status).toBe(400);
	});

	it('should handle invalid JSON', async () => {
		const logger = loggingModule.default;
		const request = new Request('http://localhost/log', {
			method: 'POST',
			body: 'invalid json {',
		});

		const response = await postWithRequest(request);

		expect(response.status).toBe(500);
		expect(logger.error).toHaveBeenCalledWith('Failed to process client log', expect.any(Object));
	});

	it('should support different log levels', async () => {
		const logger = loggingModule.default;

		for (const level of ['error', 'warn', 'info', 'debug']) {
			vi.clearAllMocks();

			const request = new Request('http://localhost/log', {
				method: 'POST',
				body: JSON.stringify({
					level,
					message: `Test ${level}`,
				}),
			});

			const response = await postWithRequest(request);

			expect(response.status).toBe(200);
			expect(logger[level as keyof typeof logger]).toHaveBeenCalled();
		}
	});
});
