import type {
	HTTPStatusCode2xx,
} from '$indexcards';
import type { Problem } from '$indexcards/schemas';

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
	// if the input already looks like a query result, use it as-is. This allows callers to pass either the raw response or a
	// query-like object without needing to wrap it themselves.
	if (typeof input === 'object' && 'data' in input) {
		return input as QueryLike<TResponse, TQueryError>;
	}
	return {
		data: input,
		error: null,
	};
}

const defaultBadRequestHandler = (problem: Problem) => {
	console.warn('Bad request response:', problem);
};

const defaultUnauthorizedHandler = (problem: Problem) => {
	console.warn('Unauthorized response:', problem);
};

const defaultForbiddenHandler = (problem: Problem) => {
	console.warn('Forbidden response:', problem);
};

const defaultServerErrorHandler = (problem: Problem) => {
	console.error('Server error response:', problem);
};

const defaultProblemHandler = (problem: Problem) => {
	console.warn('Unhandled API problem response:', problem);
};

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
		handlers.queryError?.(query.error);
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
		handlers.queryError?.(error as TMutationError);
		return null;
	}
}