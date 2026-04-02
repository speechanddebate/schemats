import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getRestParadigmQueryKey, getRestParadigmUrl } from '$indexcards';
import { orvalFetch } from '$indexcards/utils';

export const load: PageLoad = async ({ params, parent, fetch }) => {
	const personId = Number(params.id);

	if (!Number.isInteger(personId) || personId <= 0) {
		throw error(404);
	}

	const { queryClient } = await parent();

	void queryClient.prefetchQuery({
		queryKey: getRestParadigmQueryKey(personId),
		queryFn: () => orvalFetch(getRestParadigmUrl(personId), fetch),
	});
};
