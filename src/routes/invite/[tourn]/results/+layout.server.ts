import type { LayoutLoad } from '../$types';
import { requireLogin } from '$lib/helpers/auth.server';

export const load: LayoutLoad = async ({ }) => {
	requireLogin();
};