<script lang="ts">

	import { indexFetch } from '$lib/indexfetch';

	import Page from '$lib/invite/Page.svelte';
	import { page } from '$app/state';

	// Page paramters need to be wrapped in derived blocks still.
	let key = $derived(page.params.slug);
	let pageContent = $derived(indexFetch('/public/pages', { key }));

</script>

{#if pageContent }
	<Page
		fetchError   = {pageContent.error}
		fetchStatus  = {pageContent.status}
		isFetching   = {pageContent.isFetching}
		pageData     = {pageContent.data}
		slug         = {key}
	/>
{:else}
	<h4>No such page found</h4>
{/if}