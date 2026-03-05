import type { LayoutLoad } from './$types';
import grab from 'grab-url';

export const load : LayoutLoad = async ({ params }) => {
	return await grab(`pages/invite/webname/${params.tourn}`);
};

export const ssr = false;