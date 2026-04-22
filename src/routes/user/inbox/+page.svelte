<script lang="ts">
	import {
		createUserInbox,
		createUserInboxGetMessage,
		createUserInboxMarkRead,
		createUserInboxMarkUnread,
		createUserInboxMarkDeleted,
		createPostUserInboxMarkAllRead,
		getUserInboxUnreadQueryKey,
	} from '$indexcards';
	import { createAppColumnHelper } from '$lib/components/utils/table.hook';
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
	const unreadMsgMutation = createUserInboxMarkUnread();
	const deleteMsgMutation = createUserInboxMarkDeleted();
	const markAllReadMutation = createPostUserInboxMarkAllRead();

	let selectedMessage = $derived(safeExtract(messageQuery));

	const columnHelper = createAppColumnHelper<InboxMessage>();

	const columns = columnHelper.columns([
		columnHelper.accessor('readAt',{
			id: 'status',
			header: '',
			size: 10,
			maxSize: 20,
			enableResizing: false,
			enableSorting: false,
			cell: (info) => renderSnippet(statusCell, info.getValue()),
		}),
		columnHelper.accessor((row) => showDateTime({dtISO: row.visibleAt}), {
			id: 'date',
			header: 'Date',
			size: 15,
		}),
		columnHelper.accessor('subject', {
			id: 'subject',
			header: 'Subject',
			sortFn: 'alphanumeric',
			cell: (info) => renderSnippet(subjectCell, info.row.original),
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

	const markMsgUnread = async (msgId: number) => {
		await unreadMsgMutation.mutateAsync({ messageId: msgId });
		selectedMsgId = 0;
		await refreshInbox();
	};

	const getInboxRowClassName = (row: InboxMessage) =>
		row.id === selectedMsgId ? 'inbox-row-selected' : '';
</script>

{#snippet statusCell(readAt: string | null)}
	{#if !readAt}
		<EnvelopeSolid />
	{:else}
		<EnvelopeOpenOutline />
	{/if}
{/snippet}

{#snippet subjectCell(msg: InboxMessage)}
	<span class:font-semibold={!msg.readAt}>{msg.subject ?? 'No subject'}</span>
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
						aria-label="Refresh inbox"
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
						aria-label="Mark all messages as read"
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
	<div class="flex min-h-0 flex-1 flex-col gap-3 p-3">
		<div
			class="flex min-h-0 flex-1 flex-col gap-3"
			data-testid="inbox-panes"
		>
			<div
				class="h-[33vh] max-h-[33vh] min-h-0 overflow-hidden"
				data-testid="inbox-list-pane"
			>
				<QueryTable
					{columns}
					containerClass="bg-back w-full h-full overflow-hidden"
					emptyMessage="You have no messages."
					getRowClassName={getInboxRowClassName}
					onRowClick={async (row) => await selectMsg(row.id)}
					query={inboxQuery}
				/>
			</div>
			<div
				class="min-h-0 flex-1"
				data-testid="inbox-reader-pane"
			>
				<MessageReader
					loading={selectedMsgId !== 0 && messageQuery.isPending}
					message={selectedMessage}
					onDeleteClick={deleteMsg}
					onMarkUnreadClick={markMsgUnread}
				/>
			</div>
		</div>
	</div>
</div>

<style>
	:global([data-testid="inbox-list-pane"] .tabroom-table) {
		height: 100%;
		max-height: 100%;
	}

	:global([data-testid="inbox-list-pane"] .tabroom-table .table-scroll-region) {
		height: 100%;
		max-height: 100%;
		overflow-y: auto !important;
		overflow-x: auto;
	}

	:global([data-testid="inbox-list-pane"] .tabroom-table tbody tr.inbox-row-selected),
	:global([data-testid="inbox-list-pane"] .tabroom-table tbody tr.inbox-row-selected:nth-of-type(2n)),
	:global([data-testid="inbox-list-pane"] .tabroom-table tbody tr.inbox-row-selected:hover) {
		background-color: rgb(219 234 254);
	}
</style>