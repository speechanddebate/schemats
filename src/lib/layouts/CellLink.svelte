<script lang='ts'>

	import { resolve } from '$app/paths';
	let {row, column} = $props();

	let linkUrl   = $derived(column.linkFunction(row));
	let linkClass = $derived.by( () => {
		const identifier = row[column.id];
		return column.cellClass?.[column.id]?.[identifier];
	});

	let linkText  = $derived(row[column.id]);

</script>
	<a
		class = '{linkClass} hover:text-primary-700 hover:text-decoration-line text-neutral-900 break-normal font-normal'
		href  = {resolve(linkUrl,{})}
	>{@html linkText}</a>