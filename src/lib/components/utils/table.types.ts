import type {
	ColumnDef,
	ColumnResizeMode,
	RowData,
} from '@tanstack/svelte-table';
import type { appFeatures } from './table.hook';
import type { Problem } from '$indexcards/schemas';

export type TableProps<TData extends RowData> = {
	data: TData[] | null | undefined;
	columns: ColumnDef<typeof appFeatures, TData>[];
	onRowClick?: (_row: TData) => void;
	enableColumnResizing?: boolean;
	columnResizeMode?: ColumnResizeMode;
	containerClass?: string;
	tableClass?: string;
	headerClass?: string;
	cellClass?: string;
	footerClass?: string;
	/** the message to display when the table has no data */
	emptyMessage?: string;
	isLoading?: boolean;
	isError?: boolean;
	problem?: Problem | null;
};

