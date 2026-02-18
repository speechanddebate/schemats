<script lang="ts">

    import { page } from '$app/state';
    import Sidebar from './sidebar.svelte';
	import Loading from '$lib/layouts/Loading.svelte';

	// This pattern leads to reactive data display in Svelte 5 & TanStack,
	// which is otherwise tricky.
	import { getContext } from 'svelte';
	import { indexFetch } from '$lib/indexfetch';

	import type { Webname } from '../../inviteTypes';
    import type { TournInvite } from '$lib/types/invite';
    import type { Webpage } from '$lib/types/public';

	const webname:Webname = getContext('webname');
	const pageContent = indexFetch<TournInvite>(`/rest/tourns/${webname.tournId}/invite`);

	let webPage = $derived(
		pageContent.data?.webpages?.filter(
			(webpage:Webpage) => webpage?.id === parseInt(page.params?.slug)
		)
	);

</script>

	<Loading tanstackJob={pageContent}></Loading>

	<div class="main">
		{#if webPage && webPage.length === 1}
			<h5
				class='border-b-1 border-primary-500 mb-4'
			>{webPage[0].title || 'Main' }</h5>

			{@html webPage[0].content}

		{:else }

			<h5>No Page Found</h5>

			<p>
				The page ID {page.params.slug} was not found in the tournament
				{pageContent.data?.name}
			</p>

			{ JSON.stringify(pageContent?.data?.webpages, null, 2) }
		{/if}
	</div>

	<Sidebar
		contacts = {pageContent?.data?.contacts}
		pages    = {pageContent?.data?.webpages}
		tourn    = {pageContent?.data}
	/>
