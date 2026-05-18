<script lang="ts">
	import { resolve } from '$app/paths';

	let { row, column } = $props();

	let tournName = $derived(row?.Tourn?.name || '');
	let linkUrl = $derived(column.linkFunction(row));
</script>

{#if tournName}
	<a
		class="hover:underline"
		href={resolve(linkUrl, {})}
	>
		{tournName}
	</a>
{:else}
	<span></span>
{/if}
