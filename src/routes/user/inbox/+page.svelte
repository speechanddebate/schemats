<script lang="ts">
	import {
		createUserInbox,
		createUserInboxGetMessage,
		createUserInboxMarkRead,
		createUserInboxMarkDeleted,
		createPostUserInboxMarkAllRead,
		getUserInboxUnreadQueryKey,
	} from '$indexcards';
	import { createTableColumnHelper } from '$lib/components/utils/table.types';
	import type { InboxMessage } from '$indexcards/schemas/inboxMessage';
	import { renderSnippet } from '@tanstack/svelte-table';
	import { useQueryClient } from '@tanstack/svelte-query';
	import { Button, Tooltip } from 'flowbite-svelte';
	import {
		RefreshOutline,
		EnvelopeSolid,
		EnvelopeOpenOutline,
		EnvelopeOpenSolid,
	} from 'flowbite-svelte-icons';
	import QueryTable from '$lib/components/utils/QueryTable.svelte';
    import MessageReader from '$lib/components/messageReader.svelte';
    import { safeExtract } from '$lib/helpers/query';
	import { showDateTime } from '$lib/helpers/dt';

	let selectedMsgId = $state<number>(0);
	const queryClient = useQueryClient();
	const inboxQuery = createUserInbox();

	const messageQuery = createUserInboxGetMessage(() => selectedMsgId,() => ({
		query: { enabled: selectedMsgId > 0 },
	}));
	const readMsgMutation = createUserInboxMarkRead();
	const deleteMsgMutation = createUserInboxMarkDeleted();
	const markAllReadMutation = createPostUserInboxMarkAllRead();

	let selectedMessage = $derived(safeExtract(messageQuery));

	const columnHelper = createTableColumnHelper<InboxMessage>();

	const columns = columnHelper.columns([
		columnHelper.display({
			id: 'status',
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

	const refreshInbox = async () => {
		await inboxQuery.refetch();
		await queryClient.refetchQueries({
			queryKey: getUserInboxUnreadQueryKey(),
		});
	};

	const selectMsg = async (msgId: number) => {
		selectedMsgId = msgId;
		await readMsgMutation.mutateAsync({ messageId: msgId });
		await refreshInbox();
	};

	const markAllRead = async () => {
		await markAllReadMutation.mutateAsync();
		await refreshInbox();
		if (selectedMsgId > 0) {
			await messageQuery.refetch();
		}
	};

	const deleteMsg = async (msgId: number) => {
		await deleteMsgMutation.mutateAsync({ messageId: msgId });
		selectedMsgId = 0;
		await refreshInbox();
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
	<section class="mx-3 mt-3 rounded-md border border-slate-200 bg-white px-4 py-3 shadow-sm">
		<div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
			<div>
				<h1 class="text-lg font-semibold text-slate-900">Your Tabroom Message Inbox</h1>
			</div>

			<div class="flex flex-wrap gap-2">
				<div>
					<Button
						class="h-10 w-10 border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
						disabled={inboxQuery.isFetching}
						onclick={refreshInbox}
						pill={true}
						type="button"
					>
						<RefreshOutline class="h-5 w-5" />
					</Button>
					<Tooltip placement="bottom">Refresh inbox</Tooltip>
				</div>

				<div>
					<Button
						class="h-10 w-10 border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
						disabled={markAllReadMutation.isPending}
						onclick={markAllRead}
						pill={true}
						type="button"
					>
						<EnvelopeOpenSolid class="h-5 w-5" />
					</Button>
					<Tooltip placement="bottom">
						{markAllReadMutation.isPending ? 'Marking all messages as read' : 'Mark all messages as read'}
					</Tooltip>
				</div>
			</div>
		</div>

			<p class="text-sm text-slate-600">
					Note that messages won't live here forever; they'll be auto-deleted starting a week after the tournament
					that sent them is over, or a month after they're sent if they're not tied to a tournament. Messages from
					tournaments appear here even when normal email delivery is unreliable.
				</p>
	</section>

	<QueryTable
		{columns}
		emptyMessage="You have no messages."
		onRowClick={async (row) => await selectMsg(row.id)}
		query={inboxQuery}
	/>
	<MessageReader message={selectedMessage} onDeleteClick={deleteMsg}/>
</div>