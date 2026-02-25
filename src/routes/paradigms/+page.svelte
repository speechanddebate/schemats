<script lang="ts">
	import { createSearchParadigms, createGetParadigmByPersonId } from '$indexcards';
	import { afterNavigate, goto } from '$app/navigation';
	import { TabItem, Tabs } from 'flowbite-svelte';
	import { userTimeZone, userLocale } from '$lib/stores/userTimeZone';
    import Sidebar from '$lib/layouts/Sidebar.svelte';
    import { longDateTimeFormat } from '$lib/helpers/dateTime';

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
			goto(`/paradigms?id=${id}`, { replaceState: true });
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

	const selectedResult = $derived.by(() => {
		if (selectedId && results.length > 0) {
			return results.find(r => r.id === selectedId);
		}
		return null;
	});

	const paradigmDetails = $derived.by(() => {
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
			<div class="rounded-lg border border-secondary-200 bg-white p-6">
				{#if results.length > 0}
					<button
						class="mb-4 text-sm text-secondary-600 hover:text-secondary-900 font-semibold"
						onclick={clearSelection}
						type="button"
					>
						← Back to results
					</button>
				{/if}
				<h2 class="text-3xl font-bold text-secondary-900 mb-6 flex items-center justify-between">
					<span>{selectedResult?.name || paradigmDetails?.name || 'Paradigm'}</span>
					{#if paradigmDetails?.lastReviewed}
						<span class="text-base font-normal text-secondary-500 ml-4 whitespace-nowrap">
							Last reviewed: {longDateTimeFormat(new Date(paradigmDetails.lastReviewed), $userTimeZone, $userLocale)}
						</span>
					{/if}
				</h2>

				<Tabs>
					<TabItem title="Paradigm">
						<div class="text-secondary-700">
							{#if paradigmDetailsQuery.isLoading}
								<p class="text-secondary-600">Loading paradigm details...</p>
							{:else if paradigmDetails}
								{#if paradigmDetails.paradigm}
									<div class="prose prose-sm max-w-none">
										{@html paradigmDetails.paradigm}
									</div>
								{:else}
									<p class="text-secondary-600">No paradigm text available</p>
								{/if}
							{:else if selectedResult?.schools && selectedResult.schools.length > 0}
								<p class="text-sm font-semibold text-secondary-700 mb-3">Has judged for</p>
								<div class="flex flex-wrap gap-2">
									{#each selectedResult.schools as school, i (selectedResult.id + '-' + i)}
										<span class="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
											{school.name}
										</span>
									{/each}
								</div>
							{:else}
								<p class="text-secondary-600">No paradigm information available</p>
							{/if}
						</div>
					</TabItem>
					<TabItem title="Record">
						<div class="text-secondary-700">
							<p class="text-secondary-600">Record information coming soon</p>
						</div>
					</TabItem>
					<TabItem title="Certifications">
						<div class="text-secondary-700">
							<p class="text-secondary-600">Certifications information coming soon</p>
						</div>
					</TabItem>
				</Tabs>
			</div>
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
