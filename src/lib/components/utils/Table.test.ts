import { fireEvent, render, screen } from '@testing-library/svelte';

import Table from './Table.svelte';
import { createTableColumnHelper } from './table.types';

type Row = {
	id: number;
	name: string;
	status: string;
};

const columnHelper = createTableColumnHelper<Row>();

const columns = columnHelper.columns([
	columnHelper.accessor('name', {
		header: 'Name',
		sortingFn: 'alphanumeric',
	}),
	columnHelper.accessor('status', {
		header: 'Status',
	}),
]);

const data: Row[] = [
	{ id: 1, name: 'Bravo', status: 'read' },
	{ id: 2, name: 'Alpha', status: 'unread' },
];

describe('Table.svelte', () => {
	it('renders headers and rows', () => {
		render(Table, { data, columns });

		expect(screen.getByText('Name')).toBeInTheDocument();
		expect(screen.getByText('Status')).toBeInTheDocument();
		expect(screen.getByText('Bravo')).toBeInTheDocument();
		expect(screen.getByText('Alpha')).toBeInTheDocument();
	});

	it('shows the empty message', () => {
		render(Table, {
			data: [],
			columns,
			emptyMessage: 'Nothing here',
		});

		expect(screen.getByText('Nothing here')).toBeInTheDocument();
	});

	it('does not render a tfoot when no footers are defined', () => {
		const { container } = render(Table, { data, columns });

		expect(container.querySelector('tfoot')).not.toBeInTheDocument();
	});

	it('calls onRowClick with the clicked row', async () => {
		const onRowClick = vi.fn();

		render(Table, { data, columns, onRowClick });

		await fireEvent.click(screen.getByText('Bravo'));

		expect(onRowClick).toHaveBeenCalledTimes(1);
		expect(onRowClick).toHaveBeenCalledWith(data[0]);
	});

	it('sorts rows when clicking a sortable header', async () => {
		render(Table, { data, columns });

		const nameHeader = screen.getByRole('button', { name: /name/i });
		await fireEvent.click(nameHeader);

		const bravoCell = screen.getByText('Bravo');
		const alphaCell = screen.getByText('Alpha');

		expect(alphaCell.compareDocumentPosition(bravoCell)).toBe(
			Node.DOCUMENT_POSITION_FOLLOWING,
		);
	});
});
