import config from '$config';
import type { LayoutLoad } from './$types';

export const load : LayoutLoad = async ({ fetch, params }) => {
	const queryUrl = `${config.indexcards.host}${config.indexcards.basePath}/pages/invite/webname/${params.tourn}`;
	const response = await fetch(queryUrl, { credentials: 'include' });
	return await response.json();
};

export const ssr = false;