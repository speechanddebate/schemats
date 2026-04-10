<script
	generics="TResponse extends import('$lib/helpers/query').OrvalEnvelope"
	lang="ts"
>
	import type { RowData } from '@tanstack/svelte-table';
	import Table from './Table.svelte';
	import { safeExtract, type ExtractedRow, type OrvalEnvelope, type QueryLike } from '$lib/helpers/query';
	import type { TableProps } from './table.types';
    import type { CreateInfiniteQueryResult, CreateQueryResult } from '@tanstack/svelte-query';
    import type { Problem } from '$indexcards/schemas';

	type TableRow = Extract<ExtractedRow<TResponse>, RowData>;

	type Props = Omit<TableProps<TableRow>, 'data' | 'isLoading'> & {
		data?: TableRow[] | null | undefined;
		query: CreateQueryResult<TResponse, Problem> | CreateInfiniteQueryResult<TResponse, Problem>,
		isLoading?: boolean;
	};

	let {
		query,
		...tableProps
	}: Props = $props();

	const resolvedData = $derived.by(() => {
		// If query is a QueryLike (has 'data' property), call safeExtract
		//basically if this is an orval query
		if (query && typeof query === 'object' && 'data' in query) {
			return safeExtract(query as QueryLike<OrvalEnvelope, Problem>);
		}
		throw Error('Unsupported query type');
	});
</script>

<Table
	{...tableProps}
	data={resolvedData}
	isError={query.isError}
	isLoading={query?.isLoading}
	problem={query.error}
/>