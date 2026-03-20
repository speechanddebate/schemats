<script lang="ts">

    import { page } from '$app/state';
    import Sidebar from './sidebar.svelte';
	import Loading from '$lib/layouts/Loading.svelte';

	// This pattern leads to reactive data display in Svelte 5 & TanStack,
	// which is otherwise tricky.
	import { getContext } from 'svelte';
	import { indexFetch } from '$lib/indexfetch';

	import type { Tourn } from '$indexcards/schemas';
	const tourn:Tourn = getContext('webnameTourn');
	const pageContent = $derived(indexFetch(`/rest/tourns/${tourn.id}/invite`));

	let webPage = $derived.by( () => {
		const myPages = pageContent.data?.Webpages?.filter(
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(webpage:any) => webpage?.id === parseInt(page.params?.slug)
		);
		if (myPages?.length > 0) {
			return myPages[0];
		}
	});

	let slug = $derived(page.params.slug);

</script>

	<Loading tanstackJob={pageContent}></Loading>

	{#if pageContent.data}
		<div class="main">
			{#if webPage}
				<h5
					class='border-b border-primary-500 mb-4'
				>{webPage.title || 'Main' }</h5>
				{@html webPage.content}
			{:else }
				<h5>No Page Found</h5>
				<p>
					The page ID {slug} was not found in the tournament {tourn.name}
				</p>
			{/if}
		</div>

		<Sidebar
			tourn    = {pageContent.data}
		/>
	{/if}