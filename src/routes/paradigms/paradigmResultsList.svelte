<script lang="ts">
	import type { RestParadigms200Item, Problem } from '$indexcards/schemas';
	import type { CreateInfiniteQueryResult } from '@tanstack/svelte-query';

	import ParadigmListItem from './[id]/paradigmListItem.svelte';
	import InfiniteScroll from '$lib/components/utils/infiniteScroll.svelte';

	type Props = {
		results: RestParadigms200Item[];
		searchTerm: string;
		selectedHref: (id: number) => string;
		paradigmsQuery: CreateInfiniteQueryResult<unknown, Problem>;
	};

	const {
		results,
		searchTerm,
		selectedHref,
		paradigmsQuery,
	}: Props = $props();
</script>

<InfiniteScroll query={paradigmsQuery}>
	{#if results.length > 0}
		<div class="mx-auto flex w-full flex-col gap-3 overflow-y-auto">
			{#each results as result (result.id)}
				<ParadigmListItem href={selectedHref(result.id)} item={result} />
			{/each}
		</div>
	{:else}
		<p class="text-sm text-secondary-600">No paradigms found matching "{searchTerm}"</p>
	{/if}
</InfiniteScroll>
