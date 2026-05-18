<script lang='ts'>

	import { getContext } from 'svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	import { Select, Label } from 'flowbite-svelte';
	import indexFetch from '$lib/indexfetch';
	import Sidebar from '$lib/layouts/Sidebar.svelte';
	import type { Entry, Tourn } from '$indexcards/schemas';

	let { event } = $props();
	let selectedEntryId = $derived(parseInt(page.params.entryId));
	let tourn:Tourn = getContext('webnameTourn');

	let field = $derived(indexFetch(`/rest/tourns/${tourn.id}/events/${event.abbr}/field`));

	let selections = $derived.by( () => {
		return field.data?.Entries.map( (entry:Entry) => {
			return {
				value: entry.id,
				name: `${entry.code}: ${entry.name}`,
			};
		});
	});

</script>

	{#if field.isSuccess}

		<Sidebar>
			<div class="sidenote">
				<h4>Entries in {event.abbr}</h4>
				<Label>
					Select a competitor
					<Select
						id       = 'entryRecords'
						class    = "mt-2"
						items    = {selections}
						onchange = { () => {
							goto(`/invite/${tourn.id}/entries/${selectedEntryId}`);
						}}
						bind:value={selectedEntryId}
					/>
				</Label>
			</div>
		</Sidebar>
	{/if}
