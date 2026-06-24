import { browser } from '$app/environment';
import {
	INDEXCARDS_HOST,
	INDEXCARDS_CLIENT_HOST,
	INDEXCARDS_BASE_PATH,
} from '$env/dynamic/public';

export const indexcardsApiBaseUrl = (): string =>
	browser
		? `${INDEXCARDS_CLIENT_HOST ? INDEXCARDS_CLIENT_HOST : INDEXCARDS_HOST}${INDEXCARDS_BASE_PATH}`
		: `${INDEXCARDS_HOST}${INDEXCARDS_BASE_PATH}`;