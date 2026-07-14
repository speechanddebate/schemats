import { indexcardsApiBaseUrl } from '$indexcards/runtime';
import type { LayoutLoad } from './$types';
import type { Tourn } from '$indexcards/schemas';

export const load : LayoutLoad = async ({ fetch, params }) => {
	const queryUrl = `${indexcardsApiBaseUrl()}/pages/invite/webname/${params.tourn}`;
	const response = await fetch(queryUrl, { credentials: 'include' });
	const tourn: Tourn = await response.json();
	return {
		tourn,
	};
};

export const ssr = false;