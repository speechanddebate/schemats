<script lang="ts">
	import { createRestParadigmsInfinite } from '$indexcards';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { setContext } from 'svelte';
	import { Search, Button } from 'flowbite-svelte';

	import { safeExtract } from '$lib/helpers/query';
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
	let mobileResultsOpen = $state(false);
	let lastPathname = $state('');

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
			.map((pageResult) => safeExtract({ data: pageResult, error: null }))
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

	function openMobileResults() {
		mobileResultsOpen = true;
	}

	function closeMobileResults() {
		mobileResultsOpen = false;
	}

	$effect(() => {
		const nextSearch = page.url.searchParams.get('search')?.trim() ?? '';
		if (nextSearch === searchTerm) return;
		searchTerm = nextSearch;
		query = nextSearch;
		mobileResultsOpen = false;
	});

	$effect(() => {
		if (!isDetailPage) {
			mobileResultsOpen = false;
		}
	});

	$effect(() => {
		const pathname = page.url.pathname;
		if (!lastPathname) {
			lastPathname = pathname;
			return;
		}

		if (pathname !== lastPathname) {
			mobileResultsOpen = false;
			lastPathname = pathname;
		}
	});
</script>

<div class="flex min-h-[80vh] flex-wrap override px-2 sm:px-4 bg-white">
	<div class="w-full pb-1 pl-1 pt-0 sm:pl-2">
			<h2>Judge Paradigms</h2>
	</div>
	<div class="main !w-full !px-3 !pb-6 !pt-2 sm:!px-5">
		{#if isDetailPage}
			<div class="flex w-full flex-col gap-3 lg:flex-row lg:gap-5">
				<aside class="order-1 w-full lg:order-1 lg:w-[24rem] lg:self-start lg:sticky lg:top-3 xl:w-[26rem]">
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

						{#if showResults}
							<div class="mt-3 lg:hidden">
								<Button class="w-full" color="alternative" onclick={openMobileResults} type="button">
									View Results ({results.length})
								</Button>
							</div>
						{/if}
					</div>

					{#if showResults}
						<div class="mt-3 hidden max-h-[calc(100dvh-14rem)] overflow-y-auto pr-1 lg:block">
							<ParadigmResultsList
								paradigmsQuery={paradigmsQuery}
								results={results}
								searchTerm={searchTerm}
								selectedHref={selectedHref}
							/>
						</div>
					{/if}
				</aside>

				<section class="order-2 min-w-0 flex-1 lg:order-2">
					{@render children()}
				</section>
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

{#if mobileResultsOpen && isDetailPage && showResults}
	<div class="fixed inset-0 z-50 lg:hidden" aria-modal="true" role="dialog">
		<button
			class="absolute inset-0 bg-black/45"
			aria-label="Close results"
			onclick={closeMobileResults}
			type="button"
		></button>
		<div
			class="absolute right-0 top-0 h-full w-full overflow-y-auto border-l border-secondary-400 bg-white p-4
				sm:w-[92%] sm:max-w-md"
		>
			<div class="mb-4 flex items-center justify-between">
				<h3 class="text-xl font-semibold text-slate-900">Search Results</h3>
				<Button color="light" onclick={closeMobileResults} type="button">Close</Button>
			</div>
			<ParadigmResultsList
				paradigmsQuery={paradigmsQuery}
				results={results}
				searchTerm={searchTerm}
				selectedHref={selectedHref}
			/>
		</div>
	</div>
{/if}
