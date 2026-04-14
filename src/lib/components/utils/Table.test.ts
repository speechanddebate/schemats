import { fireEvent, render, screen } from '@testing-library/svelte';
import type { Component } from 'svelte';
import Table from './Table.svelte';
import { createAppColumnHelper } from './table.hook';
import type { TableProps } from './table.types';

type Row = {
	id: number;
	name: string;
	status: string;
};
//needed bc svelte testing library doesn't properly infer generic types when using the component directly
type TableRowComponent = Component<TableProps<Row>>;
const TypedTable = Table as unknown as TableRowComponent;

const columnHelper = createAppColumnHelper<Row>();

const columns = columnHelper.columns([
	columnHelper.accessor((row) => row.name, {
		id: 'name',
		header: 'Name',
		sortFn: 'alphanumeric',
	}),
	columnHelper.accessor((row) => row.status, {
		id: 'status',
		header: 'Status',
	}),
]);

const data: Row[] = [
	{ id: 1, name: 'Bravo', status: 'read' },
	{ id: 2, name: 'Alpha', status: 'unread' },
];

describe('Table.svelte', () => {
	it('renders headers and rows', () => {
		render(TypedTable, { data, columns });

		expect(screen.getByText('Name')).toBeInTheDocument();
		expect(screen.getByText('Status')).toBeInTheDocument();
		expect(screen.getByText('Bravo')).toBeInTheDocument();
		expect(screen.getByText('Alpha')).toBeInTheDocument();
	});

	it('shows the empty message', () => {
		render(TypedTable, {
			data: [],
			columns,
			emptyMessage: 'Nothing here',
		});

		expect(screen.getByText('Nothing here')).toBeInTheDocument();
	});

	it('does not render a tfoot when no footers are defined', () => {
		const { container } = render(TypedTable, { data, columns });

		expect(container.querySelector('tfoot')).not.toBeInTheDocument();
	});

	it('calls onRowClick with the clicked row', async () => {
		const onRowClick = vi.fn();

		render(TypedTable, { data, columns, onRowClick });

		await fireEvent.click(screen.getByText('Bravo'));

		expect(onRowClick).toHaveBeenCalledTimes(1);
		expect(onRowClick).toHaveBeenCalledWith(data[0]);
	});

	it('sorts rows when clicking a sortable header', async () => {
		render(TypedTable, { data, columns });

		const nameHeader = screen.getByRole('button', { name: /name/i });
		await fireEvent.click(nameHeader);

		const bravoCell = screen.getByText('Bravo');
		const alphaCell = screen.getByText('Alpha');

		expect(alphaCell.compareDocumentPosition(bravoCell)).toBe(
			Node.DOCUMENT_POSITION_FOLLOWING,
		);
	});
	describe('column resizing', () => {
		it('does not render the resize handle when enableColumnResizing is false', () => {
			const { container } = render(TypedTable, {
				data,
				columns,
				enableColumnResizing: false,
			});

			expect(container.querySelector('.table-column-resizer')).not.toBeInTheDocument();
		});
		it('renders the resize handle when enableColumnResizing is true', () => {
			const { container } = render(TypedTable, {
				data,
				columns,
				enableColumnResizing: true,
			});

			expect(container.querySelector('.table-column-resizer')).toBeInTheDocument();
		});
		it('does not render the resize handle when a column has enableResizing set to false', () => {
			const customColumns = columnHelper.columns([
				columnHelper.accessor('name', {
					header: 'Name',
					sortFn: 'alphanumeric',
					enableResizing: false,
				}),
				columnHelper.accessor('status', {
					header: 'Status',
					enableResizing: true,
				}),
			]);

			const { container } = render(TypedTable, {
				data,
				columns: customColumns,
				enableColumnResizing: true,
			});

			expect(container.querySelectorAll('.table-column-resizer').length).toBe(1);
		});
	});
});
