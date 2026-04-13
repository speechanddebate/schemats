import { requireLogin } from '$lib/server/auth';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ url }) => {
	if (!url.pathname.startsWith('/user/login')) {
		requireLogin();
	}
};
