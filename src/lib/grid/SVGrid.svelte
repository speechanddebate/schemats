<script>

    import { Pager } from '@svar-ui/svelte-core';
	import { Grid } from '@svar-ui/svelte-grid';
	import { Willow } from '@svar-ui/svelte-grid';

	let { data, columns, options } = $props();

	let limit = options.limit || import.meta.env.VITE_TOURN_LIMIT || 128;

	let pagedData = $state([]);

	const setPage = (event) => {
		const { from, to } = event;
		pagedData = data.slice(from, to);
	};

	setPage({ from: 0, to: limit });

</script>

 <Willow>
	<Grid
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