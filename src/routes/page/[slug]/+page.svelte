<script lang="ts">

	import Page from '$lib/invite/Page.svelte';
	import { webpageApi } from '$lib/invite/api';
	import { createQuery } from '@tanstack/svelte-query';

	let {data:args} = $props();
	let slug = $derived(args.slug);
	let pageContent = $state({});

	pageContent = createQuery({
		queryKey : ['publicPages', { args }],
		queryFn  : () => webpageApi().getPageBySlug(slug),
	});

	$effect(() => {
		pageContent = createQuery({
			queryKey : ['publicPages', { args }],
			queryFn  : () => webpageApi().getPageBySlug(slug),
		});
	});

	let { status, error:fetchError, isFetching, data:pageData } = $derived($pageContent);

</script>

{#if pageContent }
	<Page
		fetchError   = {fetchError}
		fetchStatus  = {status}
		isFetching   = {isFetching}
		pageData     = {pageData}
		slug         = {slug}
	/>
{:else}
	<h4>No such page found</h4>
{/if}

