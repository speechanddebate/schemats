<script lang="ts">
	import type { InboxMessage } from '$indexcards/schemas';
	import { showDateTime } from '$lib/helpers/dt';
	import { TrashBinOutline } from 'flowbite-svelte-icons';

	const { message, onDeleteClick }: {
		message: InboxMessage | null,
		onDeleteClick: (_msgId: number) => void
	} = $props();

</script>

{#if message}
	{@const senderName = message.Sender?.name?.trim() || 'Unknown sender'}
	{@const senderEmail = message.Sender?.email?.trim() || 'No email available'}
	{@const subject = message.subject?.trim() || 'No subject'}
	{@const tournName = message.Tourn?.name?.trim() || 'None'}
	{@const sentAt = showDateTime({dtISO: message.visibleAt ?? undefined})}
	{@const content = message.Email?.content?.trim() || message.body?.trim() || ''}

	<section
		class="
			mx-3 mb-3 mt-0 flex min-h-[18rem] flex-1 flex-col overflow-hidden
			rounded-md border border-sky-200 bg-white shadow-sm
		"
	>
		<div class="flex items-start justify-between gap-3 border-b border-slate-200 px-4 py-3">
			<dl
				class="
					grid flex-1 gap-x-4 gap-y-2 text-sm
					md:grid-cols-[9rem_minmax(0,1fr)]
				"
			>
				<dt class="font-semibold text-slate-500">Subject</dt>
				<dd class="text-slate-900">{subject}</dd>
				<dt class="font-semibold text-slate-500">Sender</dt>
				<dd class="text-slate-900">{senderName}</dd>

				<dt class="font-semibold text-slate-500">Sender email</dt>
				<dd>
					{#if message.Sender?.email}
						<a class="text-blue-700 underline break-all" href={`mailto:${message.Sender.email}`}>{message.Sender.email}</a>
					{:else}
						<span class="text-slate-600">{senderEmail}</span>
					{/if}
				</dd>

				<dt class="font-semibold text-slate-500">Sent</dt>
				<dd class="text-slate-900">{sentAt}</dd>

				<dt class="font-semibold text-slate-500">Tournament</dt>
				<dd class="text-slate-900">{tournName}</dd>
			</dl>

			<button
				class="
					rounded border border-slate-300 p-2 text-slate-700 transition
					hover:border-red-300 hover:bg-red-50 hover:text-red-700
				"
				aria-label="Delete message"
				onclick={() => onDeleteClick(message.id)}
				type="button"
			>
				<TrashBinOutline class="h-5 w-5" />
			</button>
		</div>

		<div class="min-h-0 flex-1 overflow-auto px-4 py-4">
			{#if content}
				<div class="message-reader-body text-sm leading-6 text-slate-800">
					{@html content}
				</div>
			{:else}
				<p class="italic text-slate-500">No message content.</p>
			{/if}
		</div>
	</section>
{:else}
	<section
		class="
			mx-3 mb-3 mt-0 flex min-h-[18rem] flex-1 items-center justify-center
			rounded-md border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center
		"
	>
		<div class="max-w-md">
			<h2 class="text-base font-semibold text-slate-800">Select a message</h2>
			<p class="mt-2 text-sm text-slate-600">
				Choose a message from your inbox to see the sender, sent date, tournament, and full contents here.
			</p>
		</div>
	</section>
{/if}

<style>
	.message-reader-body :global(a) {
		text-decoration: underline;
		word-break: break-word;
	}

	.message-reader-body :global(p) {
		margin-bottom: 0.75rem;
	}

	.message-reader-body :global(ul),
	.message-reader-body :global(ol) {
		margin: 0.75rem 0;
		padding-left: 1.25rem;
	}

	.message-reader-body :global(blockquote) {
		border-left: 3px solid rgb(203 213 225);
		color: rgb(71 85 105);
		padding-left: 0.75rem;
	}
</style>