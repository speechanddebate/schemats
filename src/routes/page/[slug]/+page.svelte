<script lang="ts">

	import type { PageProps } from './$types';
	import Page from '$lib/invite/Page.svelte';
	let { data }:PageProps = $props();

</script>

{#if data?.slug}
	<Page slug = {data?.slug} />
{:else}
	<h4>No such page found</h4>
{/if}

