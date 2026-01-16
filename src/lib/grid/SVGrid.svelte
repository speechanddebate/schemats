<script>

    import { Pager } from '@svar-ui/svelte-core';
	import { Grid } from '@svar-ui/svelte-grid';
	import { Willow } from '@svar-ui/svelte-grid';
	import { Button } from 'flowbite-svelte';
	import Papa from 'papaparse';

	let { data, columns, options } = $props();
	let limit = options.limit || import.meta.env.VITE_TOURN_LIMIT || 128;
	let pagedData = $state([]);
	let api = $state();

	const setPage = (event) => {
		const { from, to } = event;
		pagedData = data.slice(from, to);
	};

	setPage({ from: 0, to: limit });

	const printPortrait = () => {
		api.exec('print', {
			paper: options.papersize || 'letter',
			mode: 'paper',
		});
	};

	const printLandscape = () => {
		api.exec('print', {
			paper: options.papersize || 'letter',
			mode: 'landscape',
		});
	};

	const csvGrid = async () => {
		const csvData = Papa.unparse(data);
		const blob = new Blob([csvData], {type: 'text/csv;charset=utf-8'});
		const a       = document.createElement('a');
		a.href        = URL.createObjectURL(blob);
		a.download    = options.filename || 'tabroom-export.csv';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	};

</script>

<div class='p-4'>

	<div class="flex">
		<span class="w-1/3">
			<h4>CSV Export grid</h4>
		</span>

		<span class="w-2/3 parent-toolbar text-right">
			<Button
				onclick={() => printPortrait()}
			>Port</Button>

			<Button
				onclick={() => printLandscape()}
			>Land</Button>

			<Button
				onclick={() => csvGrid()}
			>CSV</Button>
		</span>
	</div>

	<Willow>
		<Grid
			bind:this={api}
			{columns}
			data = {pagedData}
			{...options}
		/>

		<Pager
			onchange = {setPage}
			pageSize = {limit}
			total    = {data.length}
		/>
	</Willow>
</div>

<style>
	.parent-toolbar :global(.tableToolbar) {
		justify-content : right;
		vertical-align  : center;
	}

	:global(.tableToolbar) {
		display: inline;
	}
</style>
