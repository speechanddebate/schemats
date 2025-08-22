<script lang="ts">

	import Page from '$lib/invite/Page.svelte';
	import { fromStore } from 'svelte/store';
	import { idxQuery } from '$lib/helpers/utils.svelte.js';
	import { page } from '$app/state';

	// This pattern leads to reactive data display in Svelte 5 & TanStack,
	// which is otherwise tricky.

	let key = $derived(page.params.slug);
	let queryStore = $derived(idxQuery({key, path: 'public/pages'}));
	let pageContent = $derived(fromStore(queryStore).current);

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

