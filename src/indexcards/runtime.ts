import {
	INDEXCARDS_HOST,
	INDEXCARDS_BASE_PATH,
} from '$app/env/public';

export const indexcardsApiBaseUrl = (): string => `${INDEXCARDS_HOST}${INDEXCARDS_BASE_PATH}`;