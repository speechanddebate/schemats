<script lang="ts">

    import { page } from '$app/state';
    import Sidebar from './sidebar.svelte';

	// This pattern leads to reactive data display in Svelte 5 & TanStack,
	// which is otherwise tricky.
	import { idxQuery } from '$lib/helpers/utils.svelte';
	import { getContext } from 'svelte';
	import { fromStore } from 'svelte/store';

	const key:string | number = getContext('inviteKey');
	let queryStore = $derived(idxQuery({key, path: 'public/invite'}));
	let pageContent = $derived(fromStore(queryStore).current);

	let webPage = $derived(pageContent.data?.pages?.filter(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(webpage:any) => webpage?.id === parseInt(page.params?.slug)
	));

</script>

	<Sidebar
		contacts = {pageContent.data.contacts}
		pages    = {pageContent.data.pages}
		tourn    = {pageContent.data.tourn}
	/>

	<div class="main">

		{#if webPage.length === 1}

			<h5
				class='border-b-1 border-primary-500 mb-4'
			>{webPage[0].title || 'Main' }</h5>

			{@html webPage[0].content}

		{:else }

			<h5>No Page Found</h5>

			<p>
				The page ID {page.params.slug} was not found in the tournament
				{pageContent.data?.tourn?.name}
			</p>

			{ JSON.stringify(pageContent.data.pages, null, 2) }
		{/if}

	</div>