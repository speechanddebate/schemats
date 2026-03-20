<script lang="ts">

	// This pattern leads to reactive data display in Svelte 5 & TanStack,
	// which is otherwise tricky.

	import { indexFetch } from '$lib/indexfetch';
	import { getContext } from 'svelte';

	import { ucfirst } from '$lib/helpers/text';
	import Sidebar from './page/[slug]/sidebar.svelte';
	import Loading from '$lib/layouts/Loading.svelte';

	import type { Webpage, Tourn } from '$indexcards/schemas';
	const tourn:Tourn = getContext('webnameTourn');
	const pageContent = $derived(indexFetch(`/rest/tourns/${tourn.id}/invite`));

	const mainPages = $derived(pageContent.data?.Webpages?.filter(
		(webpage:Webpage) => webpage.slug === 'main'
	));

</script>

	<Loading tanstackJob={pageContent}></Loading>

	<div class='main'>
		{#if mainPages && mainPages.length > 0}
			<h5
				class='border-b border-primary-500 mb-4'
			>{ ucfirst(mainPages[0].title) || 'Invitation' }</h5>

			{@html mainPages[0].content}
		{:else }
			<h5>Welcome</h5>
			<p>
				This tournament has not set up a main webpage.  For further
				information, please contact the tournament organizers, or
				consult any page links at right.
			</p>
		{/if}
	</div>

	<Sidebar
		tourn = {pageContent.data}
	/>
