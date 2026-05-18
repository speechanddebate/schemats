import type {
	HTTPStatusCode2xx,
} from '$indexcards';
import type { Problem } from '$indexcards/schemas';
import { toast } from '$lib/helpers/toasts';

export type OrvalEnvelope = {
	status: number;
	data: unknown;
};

export type SuccessData<TResponse extends OrvalEnvelope> =
	Extract<TResponse, { status: HTTPStatusCode2xx }>['data'];

export type ExtractedRow<TResponse extends OrvalEnvelope> =
	NonNullable<SuccessData<TResponse>> extends readonly (infer TItem)[]
		? TItem
		: NonNullable<SuccessData<TResponse>>;

export type QueryLike<TResponse extends OrvalEnvelope, TQueryError> = {
	data: TResponse | null | undefined;
	error?: TQueryError | null;
};

export type RequestInput<TResponse extends OrvalEnvelope, TQueryError> =
	| QueryLike<TResponse, TQueryError>
	| TResponse
	| null
	| undefined;

type QueryProblemHandlers<TQueryError> = {
	badRequest?: (problem: Problem) => void;
	unauthorized?: (problem: Problem) => void;
	forbidden?: (problem: Problem) => void;
	serverError?: (problem: Problem) => void;
	defaultProblem?: (problem: Problem) => void;
	queryError?: (error: TQueryError) => void;
};

function isOrvalEnvelope(input: unknown): input is OrvalEnvelope {
	return !!input
		&& typeof input === 'object'
		&& 'status' in input
		&& typeof (input as { status?: unknown }).status === 'number'
		&& 'data' in input;
}

function normalizeRequestInput<
	TResponse extends OrvalEnvelope,
	TQueryError = unknown,
>(
	input: RequestInput<TResponse, TQueryError>,
): QueryLike<TResponse, TQueryError> {
	if (!input) {
		return {
			data: null,
			error: null,
		};
	}
	// Query-like objects and raw envelopes both have `data`; only numeric status
	// identifies a raw Orval envelope.
	if (typeof input === 'object' && 'data' in input && !isOrvalEnvelope(input)) {
		return input as QueryLike<TResponse, TQueryError>;
	}
	return {
		data: input,
		error: null,
	};
}

const defaultBadRequestHandler = (problem: Problem) => {
	console.warn('Bad request response:', problem);
	toast.warning({
		message: problem.title ?? 'Bad request',
		detail: problem.detail,
		status: problem.status,
	});
};

const defaultUnauthorizedHandler = (problem: Problem) => {
	console.warn('Unauthorized response:', problem);
	toast.warning({
		message: problem.title ?? 'Unauthorized',
		detail: problem.detail,
		status: problem.status,
	});
};

const defaultForbiddenHandler = (problem: Problem) => {
	console.warn('Forbidden response:', problem);
	toast.warning({
		message: problem.title ?? 'Forbidden',
		detail: problem.detail,
		status: problem.status,
	});
};

const defaultServerErrorHandler = (problem: Problem) => {
	console.error('Server error response:', problem);
	toast.error({
		message: problem.title ?? 'Server error',
		detail: problem.detail,
		status: problem.status,
	});
};

const defaultProblemHandler = (problem: Problem) => {
	console.warn('Unhandled API problem response:', problem);

	if ((problem.status ?? 0) >= 500) {
		toast.error({
			message: problem.title ?? 'Request failed',
			detail: problem.detail,
			status: problem.status,
		});
		return;
	}

	toast.warning({
		message: problem.title ?? 'Request failed',
		detail: problem.detail,
		status: problem.status,
	});
};

function defaultQueryErrorHandler(error: unknown): void {
	console.error('Query error:', error);

	if (error instanceof Error) {
		toast.error({
			message: 'Request error',
			detail: error.message,
		});
		return;
	}

	if (typeof error === 'string' && error.trim()) {
		toast.error({
			message: 'Request error',
			detail: error,
		});
		return;
	}

	toast.error({
		message: 'Request error',
		detail: 'An unexpected error occurred while processing the request.',
	});
}

/**
 * Map problem status codes to handlers, with some defaults for common cases and a fallback for unhandled cases.
 */
function getProblemHandler<TQueryError>(
	status: number,
	handlers: QueryProblemHandlers<TQueryError>,
): (problem: Problem) => void {
	const byStatus: Partial<Record<number, (problem: Problem) => void>> = {
		400: handlers.badRequest ?? defaultBadRequestHandler,
		401: handlers.unauthorized ?? defaultUnauthorizedHandler,
		403: handlers.forbidden ?? defaultForbiddenHandler,
	};

	if (status >= 500) {
		return handlers.serverError ?? defaultServerErrorHandler;
	}

	return byStatus[status] ?? handlers.defaultProblem ?? defaultProblemHandler;
}

function toProblem(response: OrvalEnvelope): Problem {
	const data = response.data as Partial<Problem> | null | undefined;

	return {
		type: data?.type ?? 'about:blank',
		title: data?.title ?? 'Request failed',
		status: typeof data?.status === 'number' ? data.status : response.status,
		detail: data?.detail,
		instance: data?.instance,
		...data,
	};
}
/**
 * extracts the payload or calls a problem handler based on the status code for a given query-like input
 */
export function handleRequest<
	TResponse extends OrvalEnvelope,
	TQueryError = unknown,
>(
	input: RequestInput<TResponse, TQueryError>,
	handlers: QueryProblemHandlers<TQueryError> = {},
): SuccessData<TResponse> | null {
	const query = normalizeRequestInput(input);

	if (query.error != null) {
		if (handlers.queryError) {
			handlers.queryError(query.error);
		} else {
			defaultQueryErrorHandler(query.error);
		}
		return null;
	}

	const response = query.data;
	if (!response) {
		return null;
	}

	if (response.status >= 200 && response.status < 300) {
		return response.data as SuccessData<TResponse>;
	}

	// Orval responses are expected to return Problem payloads for non-2xx status codes.
	const problem = toProblem(response);
	getProblemHandler(response.status, handlers)(problem);
	return null;

}

export async function handleMutation<
	TResponse extends OrvalEnvelope,
	TMutationError = unknown,
>(
	mutation: Promise<TResponse> | (() => Promise<TResponse>),
	handlers: QueryProblemHandlers<TMutationError> = {},
): Promise<SuccessData<TResponse> | null> {
	try {
		const response = typeof mutation === 'function'
			? await mutation()
			: await mutation;

		return handleRequest<TResponse, TMutationError>(response, handlers);
	} catch (error) {
		if (handlers.queryError) {
			handlers.queryError(error as TMutationError);
		} else {
			defaultQueryErrorHandler(error);
		}
		return null;
	}
}