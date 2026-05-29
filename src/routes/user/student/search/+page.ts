import type { PageLoad } from './$types';
import {
	prefetchRestStudentsUnlinkedSearchQuery,
	prefetchUserStudentsLinkRequestsQuery,
} from '$indexcards';

//load the inital search results and the user's existing link requests
export const load: PageLoad = async ({ parent, fetch }) => {
	const { queryClient } = await parent();

	await Promise.all([
		prefetchRestStudentsUnlinkedSearchQuery(
			queryClient,
			undefined,
			{ fetcher: fetch },
		),
		prefetchUserStudentsLinkRequestsQuery(
			queryClient,
			{ fetcher: fetch },
		),
	]);
};
