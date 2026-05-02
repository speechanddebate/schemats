<script lang='ts'>
	import { resolve } from '$app/paths';
	let { row } = $props();

	import { getContext } from 'svelte';
	import type { Tourn } from '$indexcards/schemas';
	let tourn:Tourn = getContext('webnameTourn');

	let linkUrl = $derived(`/invite/${tourn.webname}/entries/${row.Opponent.id}`);
	let linkText = $derived(row.Opponent.code);

</script>
	<a
		class = 'hover:text-primary-700 hover:text-decoration-line break-normal font-normal'
		href  = {resolve(linkUrl,{})}
	>{@html linkText}</a>