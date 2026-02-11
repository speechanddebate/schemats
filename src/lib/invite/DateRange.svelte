<script lang="ts">

	// Wrapper because apparently you can't specify or rename the inputs for a
	// Svelte component that you send to SVAR, which is Teh Dumb, but so it
	// goes.

	import ShowDateRange from '$lib/layouts/ShowDateRange.svelte';
	import type { DtProps } from '$lib/types/dt.ts';

	let {row} = $props();

	let inputData:DtProps = $derived.by( () => {
		return {
			startISO  : row.start,
			endISO    : row.end,
			tz        : row.tz,
			mode      : 'date',
			format    : 'short',
			dateClass : 'px-1',
			timeClass : 'px-1',
		};
	});

</script>

	<ShowDateRange {...inputData} />
