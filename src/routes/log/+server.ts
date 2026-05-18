import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import logger from '$lib/helpers/logging/logging.server';

interface ClientLogPayload {
	level: 'error' | 'warn' | 'info' | 'debug';
	message: string;
	error?: {
		message?: string;
		stack?: string;
	};
	context?: Record<string, unknown>;
}

export const POST: RequestHandler = async ({ request }) => {
	try {
		const payload = (await request.json()) as ClientLogPayload;

		// Validate required fields
		if (!payload.level || !payload.message) {
			return json({ error: 'Missing level or message' }, { status: 400 });
		}

		// Log via server logger (enriches with app, host, etc.)
		logger[payload.level]('Client error', {
			message: payload.message,
			errorStack: payload.error?.stack,
			errorMessage: payload.error?.message,
			...payload.context,
		});

		return json({ success: true }, { status: 200 });
	} catch (error) {
		logger.error('Failed to process client log', {
			error: error instanceof Error ? error.message : String(error),
		});

		return json({ error: 'Failed to process log' }, { status: 500 });
	}
};
