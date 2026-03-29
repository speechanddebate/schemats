<script lang='ts'>

	import { resolve } from '$app/paths';
	let {row, column} = $props();

	let linkUrl = $derived(column.linkFunction(row));
	let linkText = $derived(row[column.id]);

</script>
	<a
		class = 'hover:text-primary-700 hover:text-decoration-line break-normal font-normal'
		href  = {resolve(linkUrl,{})}
	>{@html linkText}</a>