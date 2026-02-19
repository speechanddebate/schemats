<script lang="ts">

    import { page } from '$app/state';
    import Sidebar from './sidebar.svelte';
	import Loading from '$lib/layouts/Loading.svelte';

	// This pattern leads to reactive data display in Svelte 5 & TanStack,
	// which is otherwise tricky.
	import { getContext } from 'svelte';
	import { indexFetch } from '$lib/indexfetch';

	import type { Webname } from '../../inviteTypes';

	const webname:Webname = getContext('webname');
	const pageContent     = indexFetch(`/rest/tourns/${webname.tournId}/invite`);

	let webPage = $derived.by( () => {
		const myPages = pageContent.data?.webpages?.filter(
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(webpage:any) => webpage?.id === parseInt(page.params?.slug)
		);
		if (myPages?.length > 0) {
			return myPages[0];
		}
	});

</script>

	<Loading tanstackJob={pageContent}></Loading>

	{#if pageContent.data}
		<div class="main">
			{#if webPage}
				<h5
					class='border-b-1 border-primary-500 mb-4'
				>{webPage.title || 'Main' }</h5>

				{@html webPage.content}
			{:else }

				<h5>No Page Found</h5>

				<p>
					The page ID {page.params.slug} was not found in the tournament
					{pageContent.data?.tourn?.name}
				</p>

				{ JSON.stringify(pageContent.data.webpages, null, 2) }
			{/if}
		</div>

		<Sidebar
			contacts = {pageContent.data.contacts}
			tourn    = {pageContent.data}
			webpages = {pageContent.data.webpages}
		/>
	{/if}