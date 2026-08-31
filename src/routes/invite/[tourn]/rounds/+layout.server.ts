import { requireLogin } from '$lib/helpers/auth.server';
import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = () => {
	requireLogin();
	return;
};