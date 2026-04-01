<script lang="ts">
	import { createRestParadigm, createRestParadigmsInfinite } from '$indexcards';
	import { paradigmMainText } from '$lib/content/paradigms';
	import { afterNavigate, goto } from '$app/navigation';
	import ParadigmDetails from '$lib/components/paradigms/paradigmDetails.svelte';
	import { Search, Button } from 'flowbite-svelte';
	import ParadigmListItem from '$lib/components/paradigms/paradigmListItem.svelte';
	import { safeExtract } from '$lib/helpers/query';
	import InfiniteScroll from '$lib/components/utils/infiniteScroll.svelte';
	let query = $state('');
	let searchTerm = $state('');
	let selectedId = $state<number | null>(null);

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

	const paradigmDetailsQuery = createRestParadigm(
		() => selectedId || 0,
		() => ({
			query: {
				enabled: selectedId !== null,
			},
		}),
	);

	function handleSearch() {
		if (!query.trim()) {
			searchTerm = '';
			return;
		}
		searchTerm = query;
		selectedId = null;
	}

	function selectParadigm(id: number | undefined) {
		if (id) {
			selectedId = id;
			goto(`/paradigms?id=${id}`);
		}
	}

	function clearSelection() {
		selectedId = null;
		goto('/paradigms', { replaceState: true });
	}

	const results = $derived.by(() => {
		if (!paradigmsQuery.data || !paradigmsQuery.data.pages) return [];
		return paradigmsQuery.data.pages
			.map(page => safeExtract({ data: page, error: null }))
			.filter((data) => Array.isArray(data))
			.flat();
	});

	const showResults = $derived(searchTerm.length > 0 && !paradigmsQuery.isLoading);

	const paradigmDetailsData = $derived.by(() => {
		if (!paradigmDetailsQuery.data) return null;
		if (paradigmDetailsQuery.data.status === 200) {
			return paradigmDetailsQuery.data.data || null;
		}
		return null;
	});

	afterNavigate(() => {
		if (typeof window !== 'undefined') {
			const params = new URLSearchParams(window.location.search);
			const idParam = params.get('id');
			if (idParam) {
				const parsedId = parseInt(idParam, 10);
				selectedId = Number.isNaN(parsedId) ? null : parsedId;
			} else {
				selectedId = null;
			}
		}
	});
</script>
<svelte:head>
	<title>Paradigms{paradigmDetailsData?.name ? ` - ${paradigmDetailsData?.name}` : ''}</title>
</svelte:head>

<div class="min-h-screen max-w-7xl p-2 xs:p-4 m-auto">
	<div class="flex flex-col w-full gap-2">
		<h1 class="text-3xl font-bold text-center ">
			Search Judge Paradigms
		</h1>
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
	{#if selectedId}
		<div class="mx-auto max-w-7xl mt-4 px-4">
			<ParadigmDetails
				backFunction={clearSelection}
				data={paradigmDetailsData}
				displayBack={results.length > 0}
				isLoading={paradigmDetailsQuery.isLoading}
			/>
		</div>
	{:else if showResults}
			<div class="mx-auto max-w-7xl mt-8 px-2 xs:px-4">
				<InfiniteScroll loadingText="Loading more paradigms..." query={paradigmsQuery}>
					{#if results.length > 0}
						<div class="mx-auto flex w-full max-w-5xl flex-col gap-3 overflow-y-auto">
							{#each results as result (result.id)}
								<ParadigmListItem item={result} onClick={() => selectParadigm(result.id)} />
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