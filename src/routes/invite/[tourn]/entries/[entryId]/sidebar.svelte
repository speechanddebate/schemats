<script lang='ts'>

	import { getContext } from 'svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	import indexFetch from '$lib/indexfetch';
	import Sidebar from '$lib/layouts/Sidebar.svelte';
    import Select from '$lib/layouts/Select.svelte';
	import type { Entry, Tourn } from '$indexcards/schemas';

	let { event } = $props();
	let selectedEntryId = $derived(parseInt(page.params.entryId));
	let tourn:Tourn = getContext('webnameTourn');

	let field = $derived(indexFetch(`/rest/tourns/${tourn.id}/events/${event.abbr}/field`));

	let selections = $derived.by( () => {
		return field.data?.Entries.sort( (a:Entry, b:Entry) => {
			return a.code.localeCompare(b.code);
		}).map( (entry:Entry) => {
			return {
				value: entry.id,
				label: `${entry.code}: ${entry.name}`,
			};
		});
	});

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const options:any = {
		onchange: (selection: { value: number | string; label: string }) => {
			if (selection?.value) goto(`/invite/${tourn.id}/entries/${selection.value}`);
		},
	};

</script>

	{#if field.isSuccess}

		<Sidebar>
			<div class="sidenote">
				<h4>Entries in {event.abbr}</h4>
				<Select
					items   = {selections}
					options = {options}
					startId = {selectedEntryId}
				/>
			</div>
		</Sidebar>
	{/if}
