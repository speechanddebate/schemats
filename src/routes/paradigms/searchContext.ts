import type { RestParadigms200Item, Problem } from '$indexcards/schemas';
import type { CreateInfiniteQueryResult } from '@tanstack/svelte-query';

export type ParadigmsSearchContext = {
	getSearchTerm: () => string;
	getShowResults: () => boolean;
	getResults: () => RestParadigms200Item[];
	getSelectedHref: () => (id: number) => string;
	paradigmsQuery: CreateInfiniteQueryResult<unknown, Problem>;
};
