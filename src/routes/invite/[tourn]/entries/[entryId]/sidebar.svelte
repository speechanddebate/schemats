<script lang='ts'>

	import { getContext } from 'svelte';
	import { page } from '$app/state';
	import indexFetch from '$lib/indexfetch';
	import Sidebar from '$lib/layouts/Sidebar.svelte';
	import type { Tourn } from '$indexcards/schemas';

	let { event } = $props();
	let selectedEntryId = $derived(parseInt(page.params.entryId));
	let tourn:Tourn = getContext('webnameTourn');

	let field = $derived(indexFetch(`/rest/tourns/${tourn.id}/events/${event.abbr}/field`));

</script>

	{#if field.isSuccess}

		<Sidebar>
			<div class="sidenote">
				<h4>Entries in {event.abbr}</h4>

				{#each field.data.Entries as entry (entry.id) }
					<p
						class='{selectedEntryId === entry.id ? 'font-semibold text-primary-500' : '' }'
					>{entry.code} {entry.id} { selectedEntryId }</p>
				{/each}
			</div>
		</Sidebar>
	{/if}
