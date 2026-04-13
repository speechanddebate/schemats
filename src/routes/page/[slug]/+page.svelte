<script lang="ts">

	import { indexFetch } from '$lib/indexfetch';
	import Page from '$lib/layouts/Page.svelte';
	import Loading from '$lib/layouts/Loading.svelte';
	import { page } from '$app/state';

	// Page paramters need to be wrapped in derived blocks still.
	let pageContent = $derived( indexFetch(`/rest/pages/${page.params.slug}`) );

</script>

	<Loading tanstackJob={pageContent} />

	{#if pageContent.data}
		<Page pageData={pageContent.data} />
	{/if}
