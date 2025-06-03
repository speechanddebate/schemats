<script lang="ts">

	import Page from '$lib/invite/Page.svelte';
	import { webpageApi } from '$lib/invite/api';
	import { createQuery } from '@tanstack/svelte-query';

	let { data } = $props();
	let slug = $derived(data.slug);

	$inspect(`On reception slug is ${slug}`);

	let pageContent = $state({});

	pageContent = createQuery({
		queryKey : ['publicPages', { slug }],
		queryFn  : () => webpageApi().getPageBySlug(slug),
	});

	$effect(() => {
		pageContent = createQuery({
			queryKey : ['publicPages', { slug }],
			queryFn  : () => webpageApi().getPageBySlug(slug),
		});
	});

	$inspect(`The current slug value is ${slug}`);

</script>

{#if pageContent }
	<Page
		pageContent = {pageContent}
		slug        = {slug}
	/>
{:else}
	<h4>No such page found</h4>
{/if}

