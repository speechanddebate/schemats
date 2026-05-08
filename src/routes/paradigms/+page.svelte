<script lang="ts">
	import { getContext } from 'svelte';
	import { paradigmMainText } from '$lib/content/paradigms';
	import ParadigmResultsList from './paradigmResultsList.svelte';
	import type { ParadigmsSearchContext } from './searchContext';

	const paradigmsSearch = getContext<ParadigmsSearchContext>('paradigmsSearch');

	const searchTerm = $derived(paradigmsSearch.getSearchTerm());
	const showResults = $derived(paradigmsSearch.getShowResults());
	const results = $derived(paradigmsSearch.getResults());
	const selectedHref = $derived(paradigmsSearch.getSelectedHref());
	const paradigmsQuery = paradigmsSearch.paradigmsQuery;
</script>
<svelte:head>
	<title>Paradigms</title>
</svelte:head>

{#if showResults}
	<div class="mx-auto w-full max-w-5xl px-0">
		<ParadigmResultsList
			paradigmsQuery={paradigmsQuery}
			results={results}
			searchTerm={searchTerm}
			selectedHref={selectedHref}
		/>
	</div>
{:else }
	<div class="mx-auto max-w-5xl px-1 sm:px-2">
		<p>{@html paradigmMainText}</p>
	</div>
{/if}