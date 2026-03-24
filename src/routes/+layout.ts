import type { LayoutLoad } from './$types';
import { browser } from '$app/environment';
import { QueryClient } from '@tanstack/svelte-query';

/** handles loading and attaching session data to the root layout, so it can be
 * accessed by all child routes. This should be in a load function as it needs
 * to be present before any page is rendered to avoid a flash of
 * unauthenticated content, and it needs to run on the server to access cookies
 * securely.
 */

export const load: LayoutLoad = async ({ data }) => {

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled   : browser,
				staleTime : 60 * 100,
			},
		},
	});

	return { queryClient, sessionData: data.sessionData };
};