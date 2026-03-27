<script lang="ts">
	import { createRestTourns } from '$indexcards';
	import TournResults from '$lib/components/tables/tournResults.svelte';
	import { safeExtract } from '$lib/helpers/query';
    import { SvelteDate } from 'svelte/reactivity';

	const tournsQuery = createRestTourns(() => ({
		limit: 50,
		offset: 0,
		publishedResults: true,
		startAfter: undefined,
		startBefore: new Date(new SvelteDate().setHours(23, 59, 59, 999)).toISOString()}));

	const tournsData = $derived(safeExtract(tournsQuery));

</script>
<div>
	<TournResults data={tournsData} />
</div>
