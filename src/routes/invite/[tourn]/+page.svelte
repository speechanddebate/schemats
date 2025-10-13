<script lang="ts">

	// This pattern leads to reactive data display in Svelte 5 & TanStack,
	// which is otherwise tricky.
	import { idxQuery } from '$lib/helpers/utils.svelte';
	import { getContext } from 'svelte';
	import { fromStore } from 'svelte/store';

	import { ucfirst } from '$lib/helpers/text';
	import { showDateRange } from '$lib/helpers/dt';

	import Sidebar from './page/[slug]/sidebar.svelte';

	const key:string | number = getContext('inviteKey');
	let queryStore = $derived(idxQuery({key, path: 'public/invite'}));
	let pageContent = $derived(fromStore(queryStore).current);

	// svelte-ignore state_referenced_locally
	const mainPage = pageContent.data?.pages?.filter(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(page:any) => page.slug === 'main'
	);

	if (mainPage[0].title === 'main') {
		delete mainPage[0].title;
	}

	if (pageContent.data.tourn) {
		const { dateOutput, timeOutput } = showDateRange({
			dtEndISO   : pageContent.data.tourn.end,
			dtStartISO : pageContent.data.tourn.start,
			format     : 'medday',
			mode       : 'date',
			showTz     : true,
			tz         : pageContent.data.tourn.tz,
		});
	}

</script>

	<div class='
		main
		w-3/4
		flex-grow
		bg-back dark:bg-back-800 min-h-dvh
		py-6 px-8
		rounded'
	>
		{#if mainPage[0]}

			<h5
				class='border-b-1 border-primary-500 mb-4'
			>{ ucfirst(mainPage[0].title) || 'Invitation' }</h5>

			{@html mainPage[0].content}

		{:else }

			<h5>{pageContent.data.tourn.name}</h5>

			<p>
				This tournament has not yet set up a main webpage.  For further information, please
				contact the tournament organizers.
			</p>

		{/if}
	</div>

	<Sidebar
		contacts = {pageContent.data.contacts}
		pages    = {pageContent.data.pages}
		tourn    = {pageContent.data.tourn}
	/>
