import type { LayoutLoad } from './$types';

export const load : LayoutLoad = async ({ fetch, params }) => {
	const queryUrl = `${import.meta.env.VITE_API_URL}/pages/invite/webname/${params.tourn}`;
	const response = await fetch(queryUrl, { credentials: 'include' });
	return await response.json();
};

export const ssr = false;