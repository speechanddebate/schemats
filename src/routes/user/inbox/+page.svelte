<script lang="ts">
	import { createUserInbox } from '$indexcards';
	import { createTableColumnHelper } from '$lib/components/utils/table.types';
	import type { InboxMessage } from '$indexcards/schemas/inboxMessage';
	import { renderSnippet } from '@tanstack/svelte-table';
	import { EnvelopeSolid, EnvelopeOpenSolid } from 'flowbite-svelte-icons';
	import QueryTable from '$lib/components/utils/QueryTable.svelte';

	const inboxQuery = createUserInbox();
	const columnHelper = createTableColumnHelper<InboxMessage>();

	const columns = columnHelper.columns([
		columnHelper.display({
			id: 'status',
			header: 'Status',
			size: 20,
			cell: (info) => renderSnippet(statusCell, info.row.original),
		}),
		columnHelper.accessor((row) => row.visibleAt, {
			id: 'date',
			header: 'Date',
		}),
		columnHelper.accessor('subject', {
			header: 'Subject',
			sortingFn: 'alphanumeric',
		}),
		columnHelper.accessor((row) => row.Tourn?.name ?? null, {
			id: 'tournName',
			header: 'Tournament Name',
		}),
	]);
</script>

{#snippet statusCell(message: InboxMessage)}
	{#if !message.readAt}
		<EnvelopeSolid />
	{:else}
		<EnvelopeOpenSolid />
	{/if}
{/snippet}

<div class="m-3">
	<QueryTable
		{columns}
		onRowClick={(row) => console.log(row.subject)}
		query={inboxQuery}
	/>
	<div class="h-4"></div>
</div>
