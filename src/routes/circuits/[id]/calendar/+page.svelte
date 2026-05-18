<script lang="ts">
	import { createRestCircuit, createRestTourns } from '$indexcards';
	import { handleRequest } from '$lib/helpers/query';
	import { page } from '$app/state';
	import YearSelector from '$lib/components/YearSelector.svelte';
    import CircuitsCalendar from '$lib/components/tables/circuitsCalendar.svelte';
    import { goto } from '$app/navigation';

	const seasonParam = page.url.searchParams.get('season');

	const now = new Date();
	// Parse season query param (e.g., season=2025-2026)
	let startYear, endYear;
	if (seasonParam) {
		const match = seasonParam.match(/^(\d{4})-(\d{4})$/);
		if (match) {
			startYear = parseInt(match[1], 10);
			endYear = parseInt(match[2], 10);
		}
	}
	if (!startYear || !endYear) {
		// fallback to current season
		startYear = now.getMonth() < 6 ? now.getFullYear() - 1 : now.getFullYear();
		endYear = startYear + 1;
	}
	let seasonStart = $state(new Date(startYear, 6, 1));
	let seasonEnd   = $state(new Date(endYear, 6, 1));

	// Watch for changes and update URL there's probably a better way to do this
	$effect(() => {
		const sYear = seasonStart.getFullYear();
		const eYear = seasonEnd.getFullYear();
		const seasonStr = `${sYear}-${eYear}`;
		const url = new URL(window.location.href);
		if (url.searchParams.get('season') !== seasonStr) {
			goto(`?season=${seasonStr}`);
		}
	});

	const circuitQuery = createRestCircuit(() => (Number(page.params.id)));
	const circuitData = $derived(handleRequest(circuitQuery));
	const tournQuery = createRestTourns(() => ({
		circuit: Number(page.params.id),
		'fields[events]': 'abbr,type',
		startAfter:  seasonStart.toISOString(),
		startBefore: seasonEnd.toISOString(),
	}));
	const tournsData = $derived(handleRequest(tournQuery));

</script>
<div class="bg-white pt-4">
<p style="text-align: center;" class=" text-2xl lg:text-4xl">{circuitData?.name} District Calendar</p>
	<YearSelector bind:startDate={seasonStart} bind:endDate={seasonEnd}/>

	{#if tournQuery.isLoading}
	loading
	{:else if tournsData?.length === 0 }
	No tournaments!
	{:else}
	<CircuitsCalendar {tournsData} />
	{/if}
</div>

