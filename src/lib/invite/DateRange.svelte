<script lang="ts">

	// Wrapper because apparently you can't specify or rename the inputs for a
	// Svelte component that you send to SVAR, which is Teh Dumb, but so it
	// goes.

	import ShowDateRange from '$lib/layouts/ShowDateRange.svelte';
	import type { dtInput } from '$lib/helpers/dt';

	let {row} = $props();

	let inputData:dtInput = $derived.by( () => {
		return {
			dtStartISO : row.start,
			dtEndISO   : row.end,
			tz         : row.tz,
			mode       : 'date',
			format     : 'short',
			dateClass  : 'px-1',
			timeClass  : 'px-1',
		};
	});

</script>

	<ShowDateRange {...inputData} />
