import type { PageLoad } from './$types';
import {
	prefetchRestJudgesUnlinkedSearchQuery,
	prefetchUserJudgesLinkRequestsQuery,
} from '$indexcards';

//load the inital search results and the user's existing link requests
export const load: PageLoad = async ({ parent, fetch }) => {
	const { queryClient } = await parent();

	await Promise.all([
		prefetchRestJudgesUnlinkedSearchQuery(
			queryClient,
			undefined,
			{ fetcher: fetch },
		),
		prefetchUserJudgesLinkRequestsQuery(
			queryClient,
			{ fetcher: fetch },
		),
	]);
};
