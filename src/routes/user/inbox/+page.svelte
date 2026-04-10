<script lang="ts">
	import { createUserInbox, createUserInboxGetMessage, createUserInboxMarkRead, createUserInboxMarkDeleted } from '$indexcards';
	import { createTableColumnHelper } from '$lib/components/utils/table.types';
	import type { InboxMessage } from '$indexcards/schemas/inboxMessage';
	import { renderSnippet } from '@tanstack/svelte-table';
	import { EnvelopeSolid, EnvelopeOpenOutline } from 'flowbite-svelte-icons';
	import QueryTable from '$lib/components/utils/QueryTable.svelte';
    import MessageReader from '$lib/components/messageReader.svelte';
    import { safeExtract } from '$lib/helpers/query';
	import { showDateTime } from '$lib/helpers/dt';

	let selectedMsgId = $state<number>(0);
	const inboxQuery = createUserInbox();

	const messageQuery = createUserInboxGetMessage(() => selectedMsgId,() => ({
		query: { enabled: selectedMsgId > 0 },
	}));
	const readMsgMutation = createUserInboxMarkRead();
	const deleteMsgMutation = createUserInboxMarkDeleted();

	let selectedMessage = $derived(safeExtract(messageQuery));

	const columnHelper = createTableColumnHelper<InboxMessage>();

	const columns = columnHelper.columns([
		columnHelper.display({
			id: 'status',
			header: 'Status',
			size: 20,
			cell: (info) => renderSnippet(statusCell, info.row.original),
		}),
		columnHelper.accessor((row) => showDateTime({dtISO: row.visibleAt}), {
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

	const selectMsg = async (msgId: number) => {
		selectedMsgId = msgId;
		await readMsgMutation.mutateAsync({ messageId: msgId });
		inboxQuery.refetch();
	};
	const deleteMsg = async (msgId: number) => {
		await deleteMsgMutation.mutateAsync({ messageId: msgId });
		selectedMessage = null;
		selectedMsgId = 0;
		inboxQuery.refetch();
	};
</script>

{#snippet statusCell(message: InboxMessage)}
	{#if !message.readAt}
		<EnvelopeSolid />
	{:else}
		<EnvelopeOpenOutline />
	{/if}
{/snippet}

<div class="flex flex-1 flex-col bg-slate-50">
	<QueryTable
		{columns}
		onRowClick={async (row) => await selectMsg(row.id)}
		query={inboxQuery}
	/>
	<MessageReader message={selectedMessage} onDeleteClick={deleteMsg}/>
</div>