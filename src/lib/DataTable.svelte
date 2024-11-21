<script lang='ts'>

	import { Grid } from 'wx-svelte-grid';
	import { Willow } from 'wx-svelte-grid';

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	export let data: any[];
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	export let columns: any[] = [];

</script>

	<Willow>
		<Grid {data} {columns} />
	</Willow>

	<svelte:head>
	</svelte:head>

