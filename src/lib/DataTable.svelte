<script lang='ts'>

	import { Grid } from 'wx-svelte-grid';
	import { Willow } from 'wx-svelte-grid';

	
	
	interface Props {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		data: any[];
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		columns?: any[];
	}

	let { data, columns = [] }: Props = $props();

</script>

	<Willow>
		<Grid {data} {columns} />
	</Willow>

	<svelte:head>
	</svelte:head>

