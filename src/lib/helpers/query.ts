
import type { HTTPStatusCode2xx } from '$indexcards';

type OrvalEnvelope = {
	status: number;
	data: unknown;
};

type SuccessResponse<TResponse extends OrvalEnvelope> = Extract<
	TResponse,
	{ status: HTTPStatusCode2xx }
>;

type SuccessData<TResponse extends OrvalEnvelope> =
	SuccessResponse<TResponse>['data'];

type ErrorResponse<TResponse extends OrvalEnvelope> = Exclude<
	TResponse,
	SuccessResponse<TResponse>
>;

type QueryLike<TResponse extends OrvalEnvelope, TQueryError> = {
	data: TResponse | null | undefined;
	error?: TQueryError | null;
};

type SafeExtractError<TResponse extends OrvalEnvelope, TQueryError> =
	| {
		kind: 'response';
		response: ErrorResponse<TResponse>;
	}
	| {
		kind: 'query';
		error: TQueryError;
	};

function isSuccessResponse<TResponse extends OrvalEnvelope>(
	response: TResponse | null | undefined,
): response is SuccessResponse<TResponse> {
	return !!response && response.status >= 200 && response.status < 300;
}
/**
 * Safely extracts the typed payload from an Orval response envelope.
 *
 * Returns null when there is no response, when query.error is set,
 * or when the response status is not 2xx.
 * If provided, onError is called with either query-error or response-error details.
 *
 * @param query Query-like object whose data contains an Orval response.
 * @param onError Optional callback invoked for query or non-2xx response failures.
 * @returns The extracted success payload for 2xx responses, otherwise null.
 */
export function safeExtract<
	TResponse extends OrvalEnvelope,
	TQueryError = unknown,
>(
	query: QueryLike<TResponse, TQueryError>,
	onError?: (error: SafeExtractError<TResponse, TQueryError>) => void,
): SuccessData<TResponse> | null {
	if (query.error != null) {
		onError?.({
			kind: 'query',
			error: query.error,
		});
		return null;
	}

	const response = query.data;
	if (!response) {
		return null;
	}

	if (!isSuccessResponse(response)) {
		onError?.({
			kind: 'response',
			response: response as ErrorResponse<TResponse>,
		});
		return null;
	}

	return response.data;
}