<script lang="ts">

	// This pattern leads to reactive data display in Svelte 5 & TanStack,
	// which is otherwise tricky.
	import { idxQuery } from '$lib/helpers/utils.svelte';
	import { getContext } from 'svelte';
	import { fromStore } from 'svelte/store';

	const key:string | number = getContext('inviteKey');
	let queryStore = $derived(idxQuery({key, path: 'public/invite'}));
	let pageContent = $derived(fromStore(queryStore).current);

	// svelte-ignore state_referenced_locally
	const mainPage = pageContent.data?.pages?.filter(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(page:any) => page.slug === 'main'
	);

</script>

	{#if mainPage[0]}

		<h5
			class='border-b-1 border-primary-500 mb-4'
		>{mainPage[0].title || 'Main' }</h5>

		{@html mainPage[0].content}

	{:else }

		<h5>{pageContent.data.tourn.name}</h5>

		<p>
			This tournament has not yet set up a main webpage.  For further information, please
			contact the tournament organizers.
		</p>

	{/if}