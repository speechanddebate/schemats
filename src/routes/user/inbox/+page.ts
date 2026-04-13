import type { PageLoad } from './$types';
import { getUserInboxQueryKey, getUserInboxUrl} from '$indexcards';
import { orvalFetch } from '$indexcards/utils';

export const load: PageLoad = async ({ parent, fetch }) => {
	const { queryClient } = await parent();

	await queryClient.prefetchQuery({
		queryKey: getUserInboxQueryKey(),
		queryFn: () => orvalFetch(getUserInboxUrl(), fetch),
	});
};