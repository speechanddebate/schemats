<script lang="ts">
	import { createRestParadigmsInfinite } from '$indexcards';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { paradigmMainText } from '$lib/content/paradigms';
	import { Search, Button } from 'flowbite-svelte';
	import ParadigmListItem from '$lib/components/paradigms/paradigmListItem.svelte';
	import { safeExtract } from '$lib/helpers/query';
	import InfiniteScroll from '$lib/components/utils/infiniteScroll.svelte';

	const initialSearch = page.url.searchParams.get('search')?.trim() ?? '';
	let query = $state(initialSearch);
	let searchTerm = $state(initialSearch);

	const LIMIT = 25;
	const paradigmsQuery = createRestParadigmsInfinite(
		() => ({ search: searchTerm, limit: LIMIT }),
		() => ({
			query: {
				enabled: searchTerm.length > 0,
				getNextPageParam: (lastPage, pages) => {
					const pageData = Array.isArray(lastPage.data) ? lastPage.data : [];
					return pageData.length < LIMIT ? undefined : pages.length * LIMIT;
				},
			},
		})
	);

	function handleSearch() {
		const nextSearch = query.trim();

		if (!nextSearch) {
			searchTerm = '';
			goto('/paradigms', { replaceState: true, keepFocus: true, noScroll: true });
			return;
		}

		searchTerm = nextSearch;
		goto(`/paradigms?search=${encodeURIComponent(nextSearch)}`, {
			replaceState: true,
			keepFocus: true,
			noScroll: true,
		});
	}

	const results = $derived.by(() => {
		if (!paradigmsQuery.data || !paradigmsQuery.data.pages) return [];
		return paradigmsQuery.data.pages
			.map((pageResult) => safeExtract({ data: pageResult, error: null }))
			.filter((data) => Array.isArray(data))
			.flat();
	});

	const showResults = $derived(searchTerm.length > 0 && !paradigmsQuery.isLoading);

	const selectedHref = $derived.by(( ) => {
		if (!searchTerm) return (id: number) => `/paradigms/${id}`;
		const search = encodeURIComponent(searchTerm);
		return (id: number) => `/paradigms/${id}?search=${search}`;
	});
</script>
<svelte:head>
	<title>Paradigms</title>
</svelte:head>
<div class='flex flex-wrap min-h-[80vh] override px-4'>
	<div class='w-full pl-4 py-2'>
		<h2>
			Judge Paradigms
		</h2>
	</div>
	<div class="main">
		<div class="min-h-screen max-w-7xl p-2 xs:p-4 m-auto">
			<Search
				id="paradigm-search"
				onkeydown={(e) => e.key === 'Enter' && handleSearch()}
				placeholder="ex: Winston Smith"
				type="search"
				bind:value={query}
			>
				<Button
				class="me-1"
				color="primary"
				disabled={paradigmsQuery.isLoading}
				onclick={handleSearch}
				type="button"
				>
					{paradigmsQuery.isLoading ? 'Searching...' : 'Search'}
				</Button>
			</Search>
			{#if showResults}
					<div class="mx-auto max-w-7xl mt-8 px-2 xs:px-4">
						<InfiniteScroll query={paradigmsQuery}>
							{#if results.length > 0}
								<div class="mx-auto flex w-full max-w-5xl flex-col gap-3 overflow-y-auto">
									{#each results as result (result.id)}
										<ParadigmListItem href={selectedHref(result.id)} item={result} />
									{/each}
								</div>
								{:else}
									<p class="text-sm text-secondary-600">No paradigms found matching "{searchTerm}"</p>
								{/if}
						</InfiniteScroll>
					</div>
			{:else }
				<div class="mx-auto max-w-7xl mt-8 px-4">
					<p>{@html paradigmMainText}</p>
				</div>
			{/if}
		</div>
	</div>
</div>