import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import { prefetchRestParadigmQuery } from '$indexcards';

export const load: PageLoad = async ({ params, parent, fetch }) => {
	const personId = Number(params.id);

	if (!Number.isInteger(personId) || personId <= 0) {
		throw error(404);
	}

	const { queryClient } = await parent();

	await prefetchRestParadigmQuery(
		queryClient,
		personId,
		{ fetcher: fetch }
	);
};