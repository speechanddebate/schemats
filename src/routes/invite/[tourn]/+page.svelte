<script lang="ts">

	// This pattern leads to reactive data display in Svelte 5 & TanStack,
	// which is otherwise tricky.
	import { indexFetch } from '$lib/indexfetch';
	import { getContext } from 'svelte';

	import { ucfirst } from '$lib/helpers/text';
	import Sidebar from './page/[slug]/sidebar.svelte';
	import type { Webname } from './inviteTypes';

	const webname:Webname = getContext('webname');
	const pageContent     = indexFetch(`/rest/tourns/${webname.tournId}/invite`);

	const mainPages = $derived(pageContent.data?.pages?.filter(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(page:any) => page.slug === 'main'
	));

</script>

	{#if pageContent.status === 'pending'}
		<div class='text-success-500 font-semibold main'>
			Data Loading...
		</div>
	{:else if pageContent.status === 'error'}
		<span>Error: {pageContent.error.message}</span>
	{:else}

		{#if pageContent.isFetching}
			<div class='text-success-500 font-semibold main'>
				Data Updating...
			</div>
		{:else}

			<div class='main'>
				{#if mainPages && mainPages.length > 0}
					<h5
						class='border-b-1 border-primary-500 mb-4'
					>{ ucfirst(mainPages[0].title) || 'Invitation' }</h5>

					{@html mainPages[0].content}
				{:else }
					<h5>Welcome</h5>
					<p>
						This tournament has not set up a main webpage.  For
						further information, please contact the tournament
						organizers, or consult any page links at right.
					</p>
				{/if}
			</div>

			<Sidebar
				contacts = {pageContent.data.contacts}
				pages    = {pageContent.data.pages}
				tourn    = {pageContent.data}
			/>

		{/if}
	{/if}
