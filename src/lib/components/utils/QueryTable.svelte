<script
	generics="TResponse extends import('$lib/helpers/query').OrvalEnvelope"
	lang="ts"
>
	/**
	 * this is a wrapper around Table.svelte that can take a Orval generated query and automatically
	 * extract the data and infer loading states
	*/
	import type { RowData } from '@tanstack/svelte-table';
	import Table from './Table.svelte';
	import { handleRequest, type ExtractedRow, type OrvalEnvelope, type QueryLike } from '$lib/helpers/query';
	import type { TableProps } from './table.types';
    import type { CreateInfiniteQueryResult, CreateQueryResult } from '@tanstack/svelte-query';
    import type { Problem } from '$indexcards/schemas';

	type TableRow = Extract<ExtractedRow<TResponse>, RowData>;

	type Props = Omit<TableProps<TableRow>, 'data'> & {
		data?: TableRow[] | null | undefined;
		query: CreateQueryResult<TResponse, Problem> | CreateInfiniteQueryResult<TResponse, Problem>,
	};

	let {
		query,
		...tableProps
	}: Props = $props();

	const resolvedData = $derived.by(() => {
		// If query is a QueryLike (has 'data' property), call handleRequest
		//basically if this is an orval query
		if (query && typeof query === 'object' && 'data' in query) {
			return handleRequest(query as QueryLike<OrvalEnvelope, Problem>);
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