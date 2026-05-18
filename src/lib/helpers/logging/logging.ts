//these functions are called by client side code to send logs to the server
// where they are processed by src/routes/log/+server.ts

export type ClientLogLevel = 'error' | 'warn' | 'info' | 'debug';

export interface ClientLogPayload {
	level: ClientLogLevel;
	message: string;
	error?: {
		message?: string;
		stack?: string;
	};
	context?: Record<string, unknown>;
}

export const buildClientLogPayload = (
	level: ClientLogLevel,
	message: string,
	error: unknown,
	context: Record<string, unknown>
): ClientLogPayload => ({
	level,
	message,
	error: {
		message: error instanceof Error ? error.message : String(error),
		stack: error instanceof Error ? error.stack : undefined,
	},
	context,
});

export const postClientLog = (payload: ClientLogPayload): void => {
	try {
		window.fetch('/log', {
			method: 'POST',
			keepalive: true,
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(payload),
		});
	} catch {
		// Intentionally silent: logging should never crash the app flow.
	}
};