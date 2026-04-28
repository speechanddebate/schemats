import { browser } from '$app/environment';
import config from '$config';

export const indexcardsApiBaseUrl = (): string =>
	browser
		? `${config.indexcards.clientHost}${config.indexcards.basePath}`
		: `${config.indexcards.host}${config.indexcards.basePath}`;