<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { fn } from 'storybook/test';
	import type { InboxMessage } from '$indexcards/schemas';
	import MessageReader from '$lib/components/messageReader.svelte';

	const sampleMessage: InboxMessage = {
		id: 500,
		subject: 'Welcome to your inbox',
		body: '<p>Plain text body fallback.</p>',
		url: null,
		visibleAt: '2026-04-21T12:30:00.000Z',
		readAt: null,
		Tourn: {
			id: 12,
			name: 'Metro Championship',
			webname: 'metro-championship',
		},
		Sender: {
			name: 'Tab Staff',
			email: 'staff@tabroom.com',
		},
		Email: {
			content: '<p><strong>Hello!</strong> This is a mocked message for Storybook.</p><p>Use these stories while backend is offline.</p>',
		},
	};

	const { Story } = defineMeta({
		component: MessageReader,
		parameters: {
			a11y: {
				config: {
					rules: [
						{ id: 'scrollable-region-focusable', enabled: false },
					],
				},
			},
		},
		args: {
			message: sampleMessage,
			onDeleteClick: fn(),
			onMarkUnreadClick: fn(),
			loading: false,
		},
	});
</script>

<Story name="Default" />

<Story
	name="No Sender"
	args={{
		message: {
			...sampleMessage,
			Sender: null,
		},
	}}
/>

<Story
	name="Loading"
	args={{
		message: null,
		loading: true,
	}}
/>

<Story
	name="Empty"
	args={{
		message: null,
		loading: false,
	}}
/>
