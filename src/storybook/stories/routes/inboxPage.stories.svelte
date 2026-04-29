<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, userEvent, within } from 'storybook/test';
	import type { InboxMessage } from '$indexcards/schemas';
	import {
		getUserInboxMarkAllReadMockHandler,
		getUserInboxGetMessageMockHandler,
		getUserInboxMarkDeletedMockHandler,
		getUserInboxMarkReadMockHandler,
		getUserInboxMockHandler,
		getUserInboxUnreadMockHandler,
	} from '$indexcards/index.msw';
	import InboxPage from '../../../routes/user/inbox/+page.svelte';

	const nowISO = '2026-04-22T12:00:00.000Z';

	const createInboxMessages = (count = 8): InboxMessage[] =>
		Array.from({ length: count }, (_, idx) => {
			const id = idx + 1;
			const unread = idx % 3 !== 0;
			return {
				id,
				subject: unread ? `Unread notice ${id}` : `Read notice ${id}`,
				body: `<p>This is message ${id}.</p>`,
				url: null,
				visibleAt: `2026-04-${String(10 + idx).padStart(2, '0')}T09:00:00.000Z`,
				readAt: unread ? null : nowISO,
				Tourn: {
					id: 100 + id,
					name: `Tournament ${id}`,
					webname: `tournament-${id}`,
				},
				Sender: {
					name: id % 2 === 0 ? null : `Sender ${id}`,
					email: id % 2 === 0 ? null : `sender${id}@example.com`,
				},
				Email: {
					content: `<p><strong>Inbox message ${id}</strong> preview from Storybook.</p>`,
				},
			};
		});

	const createInboxHandlers = (count = 8) => {
		let inbox = createInboxMessages(count);

		return [
			getUserInboxMockHandler(() => inbox),
			getUserInboxUnreadMockHandler(() => ({
				count: inbox.filter((msg) => !msg.readAt).length,
			})),
			getUserInboxGetMessageMockHandler((info) => {
				const messageId = Number(info.params.messageId ?? 0);
				return inbox.find((msg) => msg.id === messageId) ?? inbox[0];
			}),
			getUserInboxMarkReadMockHandler((info) => {
				const messageId = Number(info.params.messageId ?? 0);
				inbox = inbox.map((msg) =>
					msg.id === messageId ? { ...msg, readAt: nowISO } : msg,
				);
			}),
			getUserInboxMarkAllReadMockHandler(() => {
				inbox = inbox.map((msg) => ({ ...msg, readAt: nowISO }));
			}),
			getUserInboxMarkDeletedMockHandler((info) => {
				const messageId = Number(info.params.messageId ?? 0);
				inbox = inbox.filter((msg) => msg.id !== messageId);
			}),
		];
	};

	const { Story } = defineMeta({
		component: InboxPage,
		parameters: {
			layout: 'fullscreen',
			a11y: {
				config: {
					rules: [
						{ id: 'scrollable-region-focusable', enabled: false },
						{ id: 'empty-table-header', enabled: false },
					],
				},
			},
		},
	});
</script>

<Story
	name="Default"
	parameters={{
		msw: {
			handlers: createInboxHandlers(8),
		},
	}}
/>

<Story
	name="Selected Message"
	parameters={{
		msw: {
			handlers: createInboxHandlers(8),
		},
	}}
	play={async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('select an unread message from the list', async () => {
			await userEvent.click(await canvas.findByText('Unread notice 2'));
		});

		await step('show message viewer controls', async () => {
			await expect(await canvas.findByRole('button', { name: 'Delete message' })).toBeInTheDocument();
			await expect(await canvas.findByRole('button', { name: 'Mark message as unread' })).toBeInTheDocument();
		});
	}}
/>

<Story
	name="Long Inbox Scroll"
	parameters={{
		msw: {
			handlers: createInboxHandlers(30),
		},
	}}
/>

