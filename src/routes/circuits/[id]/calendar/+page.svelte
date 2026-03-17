<script lang="ts">
	import { createRestTourns } from '$indexcards';
	import { safeExtract } from '$lib/helpers/query';
	import { page } from '$app/state';

	const now = new Date();
	const seasonStart = new Date(now.getFullYear() - (now.getMonth() < 6 ? 1 : 0), 6, 1);
	const seasonEnd   = new Date(seasonStart.getFullYear() + 1, 6, 1);

	const tournQuery = createRestTourns(() => ({
		circuit: Number(page.params.id),
		'fields[events]': 'abbr,type',
		startAfter:  seasonStart.toISOString(),
		startBefore: seasonEnd.toISOString(),
	}));
	const tournsData = $derived(safeExtract(tournQuery));
</script>
this is a page for displaying a circuit calendar
<pre>{JSON.stringify(tournsData, null, 2)}</pre>