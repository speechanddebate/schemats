import { error } from '@sveltejs/kit';
import type { PageLoad } from '../../$types';

export const load:PageLoad = (data) => {

	if (data.params) {
		if (data.params?.slug) {
			return data.params;
		}
		error(404, 'Not found');
	}

	error(404, 'No route to page found');
};
