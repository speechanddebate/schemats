import type { PageLoad } from './$types';
import { getRestCircuitsActiveQueryKey, getRestCircuitsActiveUrl} from '$indexcards';
import { orvalFetch } from '$indexcards/utils';

export const load: PageLoad = async ({ parent, fetch }) => {
	const { queryClient } = await parent();

	await queryClient.prefetchQuery({
		queryKey: getRestCircuitsActiveQueryKey(),
		queryFn: () => orvalFetch(getRestCircuitsActiveUrl(), fetch),
	});
};