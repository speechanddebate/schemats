<script lang="ts">

	// This pattern leads to reactive data display in Svelte 5 & TanStack,
	// which is otherwise tricky.
	import { indexFetch } from '$lib/indexfetch';
	import { getContext } from 'svelte';
	import Loading from '$lib/layouts/Loading.svelte';

	import Sidebar from './sidebar.svelte';

	import type { Tourn } from '$indexcards/schemas';
    import { page } from '$app/state';

	import Speech from './Speech.svelte';
	import Congress from './Congress.svelte';
	import Debate from './Debate.svelte';
	import MockTrial from './MockTrial.svelte';

	let tourn:Tourn = getContext('webnameTourn');
	// let pageContent = $derived(indexFetch(`/rest/tourns/${tourn.id}/invite`));
	let entryId = $derived(page.params.entryId);
	let entryResults = $derived(indexFetch(`/rest/tourns/${tourn.id}/entries/${entryId}/records`));
	let entry = $derived(entryResults.data);

</script>

	<Loading tanstackJob={entryResults}></Loading>

	{#if entryResults.isSuccess}

		<div class='main'>
			<div class='flex w-full m-0 p-0'>
				<span class='w-1/2'>
					<h4
						class='m-0 leading-none'
					>{ entry.code }</h4>
				</span>
				<span
					class='w-1/2 text-right m-0 p-0'
				>
					<h5
						class='leading-none'
					>{ entry.Event.name } ({entry.Event.abbr})</h5>
				</span>
			</div>

			<div class='flex w-full'>
				<span class='w-1/2'>
					<h5 class='text-primary-600 leading-none'>{ entry.name }</h5>
				</span>
				<span class='w-1/2 text-right'>
					<h6 class='text-primary-600 leading-none'>{ tourn.start.substring(0, 4) } { tourn.name }</h6>
				</span>
			</div>

			<div class='border-t-2 border-t-secondary-400 w-full pt-2'>
				{#if entry.Event.type === 'speech'}
					<Speech entry />
				{:else if entry.Event.type === 'congress'}
					<Congress entry />
				{:else if entry.Event.type === 'mockTrial'}
					<MockTrial entry />
				{:else if entry.Event.type === 'debate' || entry.Event.type === 'wsdc'}
					<Debate entry={ entry } />
				{/if}
			</div>

				<pre>
					{ JSON.stringify( entry, null, 2) }
				</pre>

		</div>

		<Sidebar event={entry.Event} />

	{/if}
