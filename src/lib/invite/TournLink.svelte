<script lang='ts'>

	import { resolve } from '$app/paths';
	let {row, column} = $props();

	const linkUrl = $derived(column.linkFunction(row));

</script>

	<a
		class = 'hover:text-primary-700 hover:text-decoration-line'
		href  = {resolve(linkUrl)}
	>
		{ row.name }
	</a>