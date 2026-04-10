import type {
	AppCellContext,
	AppColumnHelper,
	AppHeaderContext,
	CellData,
	ColumnDef,
	ColumnResizeMode,
	RowData,
	TableFeatures,
} from '@tanstack/svelte-table';
import {
	createColumnHelper,
} from '@tanstack/svelte-table';
import type { Problem } from '$indexcards/schemas';

export type TableProps<TData extends RowData> = {
	data: TData[] | null | undefined;
	columns: TableColumnDef<TData>[];
	onRowClick?: (_row: TData) => void;
	enableColumnResizing?: boolean;
	columnResizeMode?: ColumnResizeMode;
	containerClass?: string;
	tableClass?: string;
	headerClass?: string;
	cellClass?: string;
	footerClass?: string;
	emptyMessage?: string;
	isLoading?: boolean;
	isError?: boolean;
	problem?: Problem | null;
};

export type TableColumnDef<TData extends RowData> = ColumnDef<
	TableFeatures,
	TData
>;

export const defineTableColumns = <TData extends RowData>(
	columns: TableColumnDef<TData>[],
): TableColumnDef<TData>[] => columns;

export type TableCellContext<
	TData extends RowData,
	TValue extends CellData = CellData,
> = AppCellContext<
	TableFeatures,
	TData,
	TValue,
	Record<string, never>,
	Record<string, never>
>;

export type TableHeaderContext<
	TData extends RowData,
	TValue extends CellData = CellData,
> = AppHeaderContext<
	TableFeatures,
	TData,
	TValue,
	Record<string, never>
>;

export const createTableColumnHelper = <TData extends RowData>() =>
	createColumnHelper<TableFeatures, TData>() as AppColumnHelper<
		TableFeatures,
		TData,
		Record<string, never>,
		Record<string, never>
	>;

