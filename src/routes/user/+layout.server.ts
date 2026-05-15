import { requireLogin } from '$lib/helpers/auth.server';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ url }) => {
	if (!url.pathname.startsWith('/user/login')) {
		requireLogin();
	}
};
