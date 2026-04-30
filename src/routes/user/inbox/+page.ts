import type { PageLoad } from './$types';
import { prefetchUserInboxQuery} from '$indexcards';

export const load: PageLoad = async ({ parent, fetch }) => {
	const { queryClient } = await parent();

	await prefetchUserInboxQuery(
		queryClient,
		{ fetcher: fetch }
	);
};