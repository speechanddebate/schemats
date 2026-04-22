import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';

import MessageReader from './messageReader.svelte';
import type { InboxMessage } from '$indexcards/schemas/inboxMessage';

const sampleMessage: InboxMessage = {
	id: 42,
	subject: 'Inbox subject',
	body: '<p>Hello inbox</p>',
	url: null,
	visibleAt: '2026-04-20T12:00:00.000Z',
	readAt: null,
	Tourn: { id: 7, name: 'State Finals', webname: 'state-finals' },
	Sender: { name: 'Coach Ada', email: 'coach@example.com' },
	Email: { content: '<p>Rendered email body</p>' },
};

describe('MessageReader', () => {
	it('renders empty state when message is null', () => {
		render(MessageReader, {
			message: null,
			onDeleteClick: vi.fn(),
			onMarkUnreadClick: vi.fn(),
		});

		expect(screen.getByText('Select a message')).toBeInTheDocument();
	});

	it('renders message metadata and content', () => {
		render(MessageReader, {
			message: sampleMessage,
			onDeleteClick: vi.fn(),
			onMarkUnreadClick: vi.fn(),
		});

		expect(screen.getByText('Inbox subject')).toBeInTheDocument();
		expect(screen.getByText('Coach Ada')).toBeInTheDocument();
		expect(screen.getByText('State Finals')).toBeInTheDocument();
		expect(screen.getByText('Rendered email body')).toBeInTheDocument();
	});

	it('uses sender fallback text when sender is missing', () => {
		render(MessageReader, {
			message: {
				...sampleMessage,
				Sender: null,
			},
			onDeleteClick: vi.fn(),
			onMarkUnreadClick: vi.fn(),
		});

		expect(screen.getByText('Unknown sender')).toBeInTheDocument();
		expect(screen.getByText('No email available')).toBeInTheDocument();
	});

	it('calls delete callback with message id', async () => {
		const onDeleteClick = vi.fn();
		render(MessageReader, {
			message: sampleMessage,
			onDeleteClick,
			onMarkUnreadClick: vi.fn(),
		});

		await userEvent.click(screen.getByRole('button', { name: 'Delete message' }));

		expect(onDeleteClick).toHaveBeenCalledTimes(1);
		expect(onDeleteClick).toHaveBeenCalledWith(42);
	});

	it('calls mark unread callback with message id', async () => {
		const onMarkUnreadClick = vi.fn();
		render(MessageReader, {
			message: sampleMessage,
			onDeleteClick: vi.fn(),
			onMarkUnreadClick,
		});

		await userEvent.click(screen.getByRole('button', { name: 'Mark message as unread' }));

		expect(onMarkUnreadClick).toHaveBeenCalledTimes(1);
		expect(onMarkUnreadClick).toHaveBeenCalledWith(42);
	});
});
