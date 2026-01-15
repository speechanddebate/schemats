<script>

	import { Grid } from '@svar-ui/svelte-grid';
	import { Willow } from "@svar-ui/svelte-grid";

	let { data, columns, options } = $props();

	let grid;

	function handleExport() {
		if (grid) {
			grid.exportToCSV({ filename: 'tabroom-export.csv' });
		}
	}
</script>

<button on:click={handleExport} class="border-2">
  Export to CSV
</button>

 <Willow>
	<Grid
		bind:this={grid}
		{data}
		{columns}
		{...options}
	/>
</Willow>