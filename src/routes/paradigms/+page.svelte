<script lang="ts">
	import { createSearchParadigms, createGetParadigmByPersonId } from '$indexcards';
	import { afterNavigate, goto } from '$app/navigation';
    import Sidebar from '$lib/layouts/Sidebar.svelte';
	import ParadigmDetails from '$lib/components/paradigms/paradigmDetails.svelte';

	let query = $state('');
	let searchTerm = $state('');
	let selectedId = $state<number | null>(null);

	const paradigmsQuery = createSearchParadigms(
		() => ({ search: searchTerm }),
		() => ({
			query: {
				enabled: searchTerm.length > 0,
			},
		}),
	);

	const paradigmDetailsQuery = createGetParadigmByPersonId(
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
		if (!paradigmsQuery.data) return [];
		if (paradigmsQuery.data.status === 200) {
			return paradigmsQuery.data.data || [];
		}
		return [];
	});

	const loading = $derived(paradigmsQuery.isLoading);

	const paradigmDetailsData = $derived.by(() => {
		if (!paradigmDetailsQuery.data) return null;
		if (paradigmDetailsQuery.data.status === 200) {
			return paradigmDetailsQuery.data.data || null;
		}
		return null;
	});

	afterNavigate(() => {
		const params = new URLSearchParams(window.location.search);
		const idParam = params.get('id');
		if (idParam) {
			const parsedId = parseInt(idParam, 10);
			selectedId = Number.isNaN(parsedId) ? null : parsedId;
		} else {
			selectedId = null;
		}
	});
</script>

<div class="min-h-screen w-full p-4">
	{#if selectedId}
		<div class="mx-auto max-w-7xl mt-4 px-4">
			<ParadigmDetails
				backFunction={clearSelection}
				data={paradigmDetailsData}
				displayBack={results.length > 0}
				isLoading={paradigmDetailsQuery.isLoading}
			/>
		</div>
	{:else if searchTerm && !loading}
			<div class="mx-auto max-w-7xl mt-8 px-4">
				{#if results.length > 0}
					<p class="mb-4 text-sm font-semibold text-secondary-700">
						Found {results.length} result{results.length !== 1 ? 's' : ''}
					</p>
					<div class="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
						{#each results as result (result.id)}
							<button
								class="
									rounded-lg
									border border-secondary-200
									bg-white
									p-4
									transition-shadow
									hover:shadow-md
									cursor-pointer
									text-left"
								onclick={() => selectParadigm(result.id)}
								type="button"
							>
								<h3 class="text-lg font-bold text-secondary-900">{result.name}</h3>
							{#if result.tournJudged}
								<p class="text-sm text-secondary-700 mb-1">Has judged at {result.tournJudged} tournament{result.tournJudged !== 1 ? 's' : ''}</p>
							{/if}
								{#if result.schools && result.schools.length > 0}
									<div class="mt-3">
										<p class="text-sm font-semibold text-secondary-700 mb-2">Has judged for</p>
										<div class="flex flex-wrap gap-2">
											{#each result.schools as school, i (result.id + '-' + i)}
												<span class="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
													{school.name}
												</span>
											{/each}
										</div>
									</div>
								{/if}
							</button>
						{/each}
					</div>
				{:else}
					<p class="text-sm text-secondary-600">No paradigms found matching "{searchTerm}"</p>
				{/if}
			</div>
	{/if}
</div>
<Sidebar>
	<div class="flex flex-col w-full gap-2">
		<h1 class="text-xl font-bold text-center text-secondary-900">
			Search Judge Paradigms
		</h1>
		<input
			id="paradigm-search"
			class="w-full rounded-md border border-secondary-300 bg-white px-3 py-2"
			onkeydown={(e) => e.key === 'Enter' && handleSearch()}
			placeholder="ex: Kilgore Trout"
			type="search"
			bind:value={query}
		/>
		<button
			class="rounded-md bg-secondary-500 px-4 py-2 font-semibold text-white"
			disabled={loading}
			onclick={handleSearch}
			type="button"
		>
			{loading ? 'Searching...' : 'Search'}
		</button>
	</div>
</Sidebar>
