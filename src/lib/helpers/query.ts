import type {
	HTTPStatusCode2xx,
} from '$indexcards';
import type { Problem } from '$indexcards/schemas';
import { toast } from '$lib/helpers/toasts';

import type {
	CreateInfiniteQueryResult,
	CreateQueryResult,
	InfiniteData,
} from '@tanstack/svelte-query';

export type OrvalEnvelope = {
	status: number;
	data: unknown;
};

type ExtractEnvelope<T> = T extends InfiniteData<infer E> ? E : T;

export type SuccessData<TResponse extends OrvalEnvelope> =
	Extract<TResponse, { status: HTTPStatusCode2xx }>['data'];

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
	Problem?: (problem: Problem, callDefault: (problem: Problem) => void) => void;
	queryError?: (error: TQueryError, callDefault: (error: TQueryError) => void) => void;
};

type ParseOptions<TResponse extends OrvalEnvelope, TSelected> = {
	select?: (data: SuccessData<TResponse>) => TSelected;
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

type Handler<TQueryError> = (error: TQueryError, defaultHandler: (error: TQueryError) => void) => void;

/**
 * Handle a generic tanstack query. This only handles the query error state, not any problem status codes in the response data;
 * use `handleOrval` for that.
 * @param query the tanstack query result to handle
 * @param handler an object containing an optional handler for query errors; if a handler is provided, it will be called with the query error and a default handler to call if the error should be handled with default behavior. If no handler is provided, all query errors will be handled with the default behavior.
 * @returns the typed response data or null
 */
export function handleQuery<TResponse, TError>(
	query:
        | CreateQueryResult<TResponse, TError>
        | CreateInfiniteQueryResult<InfiniteData<TResponse>, TError>,
	handler?: Handler<TError>
): TResponse | InfiniteData<TResponse> | null {
	if (query.isSuccess) {
		return query.data;
	}

	if (query.isError) {
		if (handler) {
			handler(query.error, defaultQueryErrorHandler);
		} else {
			defaultQueryErrorHandler(query.error);
		}
	}

	return null;
}

/**
 * Handles the response from an Orval-generated query, including both query errors and problem status codes;
 * @param query the orval generated query
 * @param handlers an object containing optional handlers for query errors and problem status codes;
 */
export function handleOrval<
	TResponse extends OrvalEnvelope,
	TQueryError = Problem,
>(
	query: CreateQueryResult<TResponse, TQueryError> | CreateInfiniteQueryResult<InfiniteData<TResponse>, TQueryError>,
	handlers: QueryProblemHandlers<TQueryError> = {},
): Extract<ExtractEnvelope<TResponse>, { status: HTTPStatusCode2xx }>['data'] | null {
	//delegate default query error handling to handleQuery.
	const response = handleQuery(query, handlers.queryError);
	if (!response) {
		return null;
	}
	if (isInfiniteData(response)) {
		const data = response.pages.map((pageResult) => {
			if (pageResult.status >= 200 && pageResult.status < 300) {
				return pageResult.data as Extract<ExtractEnvelope<TResponse>, { status: HTTPStatusCode2xx }>['data'];
			}
			const problem = toProblem(pageResult);
			if (handlers.Problem) {
				handlers.Problem(problem, defaultProblemHandler);
			} else {
				defaultProblemHandler(problem);
			}
			return null;
		})
			.filter((d) => Array.isArray(d))
			.flat();
		return data;
	}
	//if the response is a 2xx, return the typed data.
	if(response.status >= 200 && response.status < 300) {
		return response.data as Extract<ExtractEnvelope<TResponse>, { status: HTTPStatusCode2xx }>['data'];
	}
	// Orval responses are expected to return Problem payloads for non-2xx status codes.
	const problem = toProblem(response);
	if (handlers.Problem) {
		handlers.Problem(problem, defaultProblemHandler);
	} else {
		defaultProblemHandler(problem);
	}
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

		if (response.status >= 200 && response.status < 300) {
			return response.data as SuccessData<TResponse>;
		}

		const problem = toProblem(response);
		if (handlers.Problem) {
			handlers.Problem(problem, defaultProblemHandler);
		} else {
			defaultProblemHandler(problem);
		}
		return null;
	} catch (error) {
		if (handlers.queryError) {
			handlers.queryError(error as TMutationError, defaultQueryErrorHandler);
		} else {
			defaultQueryErrorHandler(error);
		}
		return null;
	}
}

//Helper function to determine if the data is from an infinite query.
function isInfiniteData<T>(data: unknown): data is InfiniteData<T> {
	return typeof data === 'object' && data !== null && 'pages' in data && Array.isArray((data as InfiniteData<T>).pages);
}

export function parse<
	TResponse extends OrvalEnvelope,
	TSelected = SuccessData<TResponse>,
>(
	query: CreateQueryResult<TResponse, unknown>,
	options: ParseOptions<TResponse, TSelected> = {},
): {
	res: TSelected | undefined;
	problem: Problem | undefined;
} {

	const baseState = {
		res: undefined,
		problem: undefined,
	};

	if (!query.data) {
		return baseState;
	}

	if (query.data.status >= 200 && query.data.status < 300) {
		const typed = query.data.data as SuccessData<TResponse>;
		const selected = options.select ? options.select(typed) : (typed as TSelected);
		return {
			...baseState,
			res: selected,
		};
	}

	const problem = toProblem(query.data);
	return {
		...baseState,
		problem,
	};
}