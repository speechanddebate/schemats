import { error } from '@sveltejs/kit';
import type { PageLoad } from '../../$types';

interface Params {
	slug        : string,
	queryClient : object,
};

export const load:PageLoad = (data) => {

	const { slug, queryClient } = data.params as Params;

	if (slug) {
		return {
			slug,
			queryClient,
		};
	}
	error(404, 'No route to page found');
};
