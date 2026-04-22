import { render, screen, waitFor, within } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';

import InboxPage from './+page.svelte';
import type { InboxMessage } from '$indexcards/schemas/inboxMessage';

const queryClientRefetchQueries = vi.fn();
const inboxRefetch = vi.fn();
const messageRefetch = vi.fn();
const markReadMutateAsync = vi.fn();
const deleteMutateAsync = vi.fn();
const markAllReadMutateAsync = vi.fn();

const inboxMessages: InboxMessage[] = [
	{
		id: 100,
		subject: 'Unread message',
		body: '<p>Unread body</p>',
		url: null,
		visibleAt: '2026-04-20T12:00:00.000Z',
		readAt: null,
		Tourn: { id: 1, name: 'Tournament One', webname: 't1' },
		Sender: { name: 'Sender One', email: 'sender.one@example.com' },
		Email: { content: '<p>Unread body</p>' },
	},
	{
		id: 101,
		subject: 'Read message',
		body: '<p>Read body</p>',
		url: null,
		visibleAt: '2026-04-19T12:00:00.000Z',
		readAt: '2026-04-19T13:00:00.000Z',
		Tourn: { id: 2, name: 'Tournament Two', webname: 't2' },
		Sender: { name: 'Sender Two', email: 'sender.two@example.com' },
		Email: { content: '<p>Read body</p>' },
	},
];

vi.mock('@tanstack/svelte-query', async () => {
	const actual = await vi.importActual<typeof import('@tanstack/svelte-query')>(
		'@tanstack/svelte-query',
	);

	return {
		...actual,
		useQueryClient: () => ({
			refetchQueries: queryClientRefetchQueries,
		}),
	};
});

vi.mock('$indexcards', () => ({
	createUserInbox: () => ({
		data: { status: 200, data: inboxMessages },
		error: null,
		isError: false,
		isLoading: false,
		isFetching: false,
		refetch: inboxRefetch,
	}),
	createUserInboxGetMessage: () => ({
		data: null,
		error: null,
		isError: false,
		isLoading: false,
		isPending: false,
		refetch: messageRefetch,
	}),
	createUserInboxMarkRead: () => ({
		mutateAsync: markReadMutateAsync,
		isPending: false,
	}),
	createUserInboxMarkDeleted: () => ({
		mutateAsync: deleteMutateAsync,
		isPending: false,
	}),
	createPostUserInboxMarkAllRead: () => ({
		mutateAsync: markAllReadMutateAsync,
		isPending: false,
	}),
	getUserInboxUnreadQueryKey: () => ['userInboxUnread'],
}));

describe('Inbox page UI', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		inboxRefetch.mockResolvedValue({});
		messageRefetch.mockResolvedValue({});
		markReadMutateAsync.mockResolvedValue({ status: 204 });
		deleteMutateAsync.mockResolvedValue({ status: 204 });
		markAllReadMutateAsync.mockResolvedValue({ status: 204 });
		queryClientRefetchQueries.mockResolvedValue({});
	});

	it('renders unread message subject with emphasis class', () => {
		const { container } = render(InboxPage);
		const listPane = container.querySelector('[data-testid="inbox-list-pane"]');
		expect(listPane).not.toBeNull();

		const unreadSubject = within(listPane as HTMLElement).getByText('Unread message');
		expect(unreadSubject).toHaveClass('font-semibold');
	});

	it('marks selected message as read and refreshes inbox + unread count', async () => {
		const { container } = render(InboxPage);
		const listPane = container.querySelector('[data-testid="inbox-list-pane"]');
		expect(listPane).not.toBeNull();

		const unreadCell = within(listPane as HTMLElement).getByText('Unread message');
		await userEvent.click(unreadCell);

		await waitFor(() => {
			expect(markReadMutateAsync).toHaveBeenCalledWith({ messageId: 100 });
			expect(inboxRefetch).toHaveBeenCalled();
			expect(queryClientRefetchQueries).toHaveBeenCalledWith({
				queryKey: ['userInboxUnread'],
			});
			expect(unreadCell.closest('tr')).toHaveClass('inbox-row-selected');
		});
	});

	it('keeps a stacked layout with viewport-capped list pane and flexible reader pane', async () => {
		const { container } = render(InboxPage);
		const panes = container.querySelector('[data-testid="inbox-panes"]');
		const listPane = container.querySelector('[data-testid="inbox-list-pane"]');
		const readerPane = container.querySelector('[data-testid="inbox-reader-pane"]');

		expect(panes).toHaveClass('flex-col');
		expect(listPane).toHaveClass('h-[33vh]');
		expect(listPane).toHaveClass('max-h-[33vh]');
		expect(readerPane).toHaveClass('flex-1');

		await userEvent.click(within(listPane as HTMLElement).getByText('Unread message'));

		await waitFor(() => {
			expect(listPane).toHaveClass('h-[33vh]');
			expect(readerPane).toHaveClass('flex-1');
		});
	});

	it('uses a fixed-height scrolling list container', () => {
		const { container } = render(InboxPage);
		const listPane = container.querySelector('[data-testid="inbox-list-pane"]');

		expect(listPane).toHaveClass('h-[33vh]');
		expect(listPane).toHaveClass('overflow-hidden');
	});

	it('marks all as read and refreshes inbox + unread count', async () => {
		render(InboxPage);
		await userEvent.click(
			screen.getByRole('button', { name: 'Mark all messages as read' }),
		);

		await waitFor(() => {
			expect(markAllReadMutateAsync).toHaveBeenCalledTimes(1);
			expect(inboxRefetch).toHaveBeenCalled();
			expect(queryClientRefetchQueries).toHaveBeenCalledWith({
				queryKey: ['userInboxUnread'],
			});
		});
	});
});
