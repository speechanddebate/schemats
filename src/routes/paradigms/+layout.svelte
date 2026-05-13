<script lang="ts">
	import { createRestParadigmsInfinite } from '$indexcards';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { onMount, setContext } from 'svelte';
	import { Search, Button } from 'flowbite-svelte';

	import { handleRequest } from '$lib/helpers/query';
	import Sidebar from '$lib/layouts/Sidebar.svelte';
	import ParadigmResultsList from './paradigmResultsList.svelte';
	import type { ParadigmsSearchContext } from './searchContext';
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
	};

	const { children }: Props = $props();

	const LIMIT = 25;

	let query = $state('');
	let searchTerm = $state('');
	let isLgUp = $state(false);

	onMount(() => {
		const mediaQuery = window.matchMedia('(min-width: 1024px)');
		isLgUp = mediaQuery.matches;

		const handleMediaChange = (event: MediaQueryListEvent) => {
			isLgUp = event.matches;
		};

		mediaQuery.addEventListener('change', handleMediaChange);
		return () => {
			mediaQuery.removeEventListener('change', handleMediaChange);
		};
	});

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

	const results = $derived.by(() => {
		if (!paradigmsQuery.data || !paradigmsQuery.data.pages) return [];
		return paradigmsQuery.data.pages
			.map((pageResult) => handleRequest(pageResult))
			.filter((data) => Array.isArray(data))
			.flat();
	});

	const showResults = $derived(searchTerm.length > 0 && !paradigmsQuery.isLoading);
	const isDetailPage = $derived.by(() => {
		const personId = Number(page.params.id);
		return Number.isInteger(personId) && personId > 0;
	});

	const selectedHref = $derived.by(() => {
		if (!searchTerm) return (id: number) => `/paradigms/${id}`;
		const search = encodeURIComponent(searchTerm);
		return (id: number) => `/paradigms/${id}?search=${search}`;
	});

	const paradigmsSearchContext: ParadigmsSearchContext = {
		getSearchTerm: () => searchTerm,
		getShowResults: () => showResults,
		getResults: () => results,
		getSelectedHref: () => selectedHref,
		paradigmsQuery,
	};

	setContext('paradigmsSearch', paradigmsSearchContext);

	function updatePathSearch(nextSearch: string) {
		const target = new URL(page.url);
		if (!nextSearch) {
			target.searchParams.delete('search');
		} else {
			target.searchParams.set('search', nextSearch);
		}

		goto(`${target.pathname}${target.search}`, {
			replaceState: true,
			keepFocus: true,
			noScroll: true,
		});
	}

	function handleSearch() {
		const nextSearch = query.trim();
		updatePathSearch(nextSearch);
	}

	$effect(() => {
		const nextSearch = page.url.searchParams.get('search')?.trim() ?? '';
		if (nextSearch === searchTerm) return;
		searchTerm = nextSearch;
		query = nextSearch;
	});
</script>

<div class="flex min-h-[80vh] flex-wrap override px-2 sm:px-4 bg-white">
	<div class="w-full pb-1 pl-1 pt-0 sm:pl-2">
			<h2>Judge Paradigms</h2>
	</div>
	<div class="main !w-full !px-3 !pb-6 !pt-2 sm:!px-5">
		{#if isDetailPage}
			<div class="flex w-full flex-row">
				<div class="min-w-0 flex-1">
					{@render children()}
				</div>

				{#key page.url.pathname}
				<Sidebar initialOpen={isLgUp}>
					<div class="sidenote">
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
					</div>

					{#if showResults}
						<div class="sidenote mt-3 max-h-[calc(100dvh-14rem)] overflow-y-auto pr-1">
							<ParadigmResultsList
								paradigmsQuery={paradigmsQuery}
								results={results}
								searchTerm={searchTerm}
								selectedHref={selectedHref}
							/>
						</div>
					{/if}
				</Sidebar>
				{/key}
			</div>
		{:else}
			<div class="mx-auto w-full max-w-5xl">
				<div class="rounded-lg border border-secondary-300 bg-white p-3">
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
				</div>
				<section class="mt-3">
					{@render children()}
				</section>
			</div>
		{/if}
	</div>
</div>
