import type { PageLoad } from './$types';
import { prefetchRestCircuitsActiveQuery } from '$indexcards';

export const load: PageLoad = async ({ parent, fetch }) => {
	const { queryClient } = await parent();

	await prefetchRestCircuitsActiveQuery(
		queryClient,
		undefined,
		{ fetcher: fetch }
	);
};