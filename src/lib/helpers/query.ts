
import type { HTTPStatusCode2xx } from '$indexcards';

export type OrvalEnvelope = {
	status: number;
	data: unknown;
};

type SuccessResponse<TResponse extends OrvalEnvelope> = Extract<
	TResponse,
	{ status: HTTPStatusCode2xx }
>;

export type SuccessData<TResponse extends OrvalEnvelope> =
	SuccessResponse<TResponse>['data'];

export type ExtractedRow<TResponse extends OrvalEnvelope> =
	NonNullable<SuccessData<TResponse>> extends readonly (infer TItem)[]
		? TItem
		: NonNullable<SuccessData<TResponse>>;

export type QueryLike<TResponse extends OrvalEnvelope, TQueryError> = {
	data: TResponse | null | undefined;
	error?: TQueryError | null;
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
	onError?:(error: TQueryError) => void,
): SuccessData<TResponse> | null {
	if (query.error != null) {
		onError?.({
			...query.error,
		});
		return null;
	}

	const response = query.data;
	if (!response) {
		return null;
	}

	if (isSuccessResponse(response)) {
		return response.data;
	}
	return null;

}