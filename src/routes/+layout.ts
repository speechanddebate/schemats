import { browser } from '$app/environment';
import { QueryClient } from '@tanstack/svelte-query';
import type { LayoutServerData } from './$types';

export const load: LayoutServerData = async () => {

	const queryClient = await new QueryClient({
		defaultOptions: {
			queries: {
				enabled   : browser,
				staleTime : 60 * 1000,
			},
		},
	});

	return { queryClient };
};
