import { requireLogin } from '$lib/server/auth';
import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = () => {
	requireLogin();
	return;
};