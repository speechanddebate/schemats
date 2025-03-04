import { inviteApi } from '$lib/invite/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, fetch }) => {
	const { queryClient } = await parent();

	await queryClient.prefetchQuery({
		queryKey: ['tournaments', 100],
		queryFn: () => inviteApi(fetch).getTournaments(100),
	});
};