<script generics="TData extends import('@tanstack/svelte-table').RowData" lang="ts">
	import {
		createTable,
		FlexRender,
		createSortedRowModel,
		columnResizingFeature,
		columnSizingFeature,
		rowSortingFeature,
		sortFns,
		tableFeatures,
	} from '@tanstack/svelte-table';
	import type { HeaderGroup } from '@tanstack/svelte-table';
	import type { TableProps } from './table.types';
	import { Spinner } from 'flowbite-svelte';

	let {
		data = $bindable(),
		columns,
		onRowClick,
		enableColumnResizing = true,
		columnResizeMode = 'onChange',
		containerClass = 'px-3 py-3 bg-back w-full',
		tableClass = 'w-full text-sm border-collapse border border-neutral-400 rounded',
		headerClass = 'text-left px-4 py-1 text-[11px] font-semibold bg-secondary-100 border border-secondary-400',
		cellClass = 'px-4 py-1 border border-back-300 text-[12px] leading-4',
		footerClass = 'text-left px-4 py-1 text-[11px] bg-back-100 border border-neutral-300',
		emptyMessage = 'No data available',
		...props
	}: TableProps<TData> = $props();

	const _features = tableFeatures({
		rowSortingFeature,
		columnResizingFeature,
		columnSizingFeature,
	});

	// svelte-ignore state_referenced_locally
	const table = createTable({
		_features,
		enableColumnResizing,
		columnResizeMode,
		get data() {
			return data ?? [];
		},
		columns,
		_rowModels: {
			sortedRowModel: createSortedRowModel(sortFns),
		},
	} as Parameters<typeof createTable>[0]);

	// don't render footer is there are no footer rows
	function hasDefinedFooters(t: typeof table): boolean {
		t.getFooterGroups().forEach((fg: HeaderGroup<typeof _features, TData>) => {
			if(fg.headers.length > 0) {
				return true;
			}
		});
		return false;
	}
</script>

<div class="tabroom-table {containerClass}">
	<div class="table-scroll-region">
		<table
			style:table-layout="auto"
			style:width={table.getTotalSize()}
			class={tableClass}
		>
			<thead>
				{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
					<tr>
						{#each headerGroup.headers as header (header.id)}
							<th
								style:width={header.getSize()}px
								class={`${headerClass} table-header-cell`}
							>
								{#if !header.isPlaceholder}
									{#if header.column.getCanSort()}
										<button
											class="table-sort-button"
											onclick={header.column.getToggleSortingHandler()}
											type="button"
										>
											<span class="table-header-content">
												<FlexRender {header} />
											</span>
											<span class="table-sort-chevrons" aria-hidden="true">
												<span
													class="table-sort-chevron table-sort-chevron-up"
													class:table-sort-chevron-active={
														header.column.getIsSorted() === 'asc'
													}
												></span>
												<span
													class="table-sort-chevron table-sort-chevron-down"
													class:table-sort-chevron-active={
														header.column.getIsSorted() === 'desc'
													}
												></span>
											</span>
										</button>
									{:else}
										<div class="table-header-content">
											<FlexRender {header} />
										</div>
									{/if}
								{/if}
								{#if header.column.getCanResize()}
									<button
										class="table-column-resizer"
										class:table-column-resizer-active={header.column.getIsResizing()}
										aria-label="Resize column"
										ondblclick={() => header.column.resetSize()}
										onmousedown={header.getResizeHandler()}
										ontouchstart={header.getResizeHandler()}
										type="button"
									></button>
								{/if}
							</th>
						{/each}
					</tr>
				{/each}
			</thead>
			<tbody>
				{#if props.isLoading }
				<tr>
					<td class="table-empty-cell" colspan={columns.length}>
						<Spinner />
					</td>
				</tr>
				{:else if props.isError}
				<tr>
					<td class="table-empty-cell" colspan={columns.length}>

						<div class="table-error-stack">
							{#if props.problem}
								<div>{props.problem.title}</div>
								<div>{props.problem.detail}</div>
								<div>{props.problem.instance}</div>
							{:else}
								There was an Error fetching the table data.
						{/if}
						</div>
					</td>
				</tr>
				{:else if data && data.length > 0}
					{#each table.getRowModel().rows as row (row.id)}
						<tr onclick={() => onRowClick?.(row.original)}>
							{#each row.getAllCells() as cell (cell.id)}
								<td
									style:width={cell.column.getSize()}
									class={cellClass}
								>
									<div class="table-cell-content">
										<FlexRender {cell} />
									</div>
								</td>
							{/each}
						</tr>
					{/each}
				{:else}
					<tr>
						<td class="table-empty-cell" colspan={columns.length}>
							{emptyMessage}
						</td>
					</tr>
				{/if}
			</tbody>
			{#if hasDefinedFooters(table)}
				<tfoot>
					{#each table.getFooterGroups() as footerGroup (footerGroup.id)}
						<tr>
							{#each footerGroup.headers as header (header.id)}
								<th
									style:width={header.getSize()}
									class={footerClass}
								>
									{#if !header.isPlaceholder}
										<div class="table-footer-content">
											<FlexRender footer={header} />
										</div>
									{/if}
								</th>
							{/each}
						</tr>
					{/each}
				</tfoot>
			{/if}
		</table>
	</div>
</div>

<style>
	:global(.tabroom-table .table-scroll-region) {
		width: 100%;
		max-width: 100%;
		overflow-x: auto;
		overflow-y: hidden;
	}

	:global(.tabroom-table table),
	:global(.tabroom-table th),
	:global(.tabroom-table td) {
		box-sizing: border-box;
	}

	:global(.tabroom-table tbody tr:nth-of-type(2n)) {
		background-color: var(--color-neutral-100);
	}

	:global(.tabroom-table tbody tr:hover) {
		background-color: var(--color-back-100);
	}

	:global(.tabroom-table .table-header-cell) {
		position: relative;
	}

	:global(.tabroom-table .table-column-resizer) {
		position: absolute;
		top: 0;
		right: 0;
		z-index: 1;
		height: 100%;
		width: 6px;
		padding: 0;
		border: 0;
		cursor: col-resize;
		touch-action: none;
		user-select: none;
		opacity: 0;
		background-color: transparent;
	}

	:global(.tabroom-table .table-column-resizer:hover),
	:global(.tabroom-table .table-column-resizer:focus-visible),
	:global(.tabroom-table .table-column-resizer-active) {
		opacity: 1;
		background-color: var(--color-secondary-400);
	}

	:global(.tabroom-table .table-sort-button) {
		display: inline-flex;
		width: 100%;
		max-width: 100%;
		align-items: center;
		justify-content: space-between;
		gap: 0.4rem;
		background: transparent;
		border: 0;
		padding: 0;
		font: inherit;
		color: inherit;
		cursor: pointer;
	}

	:global(.tabroom-table .table-header-content),
	:global(.tabroom-table .table-cell-content),
	:global(.tabroom-table .table-footer-content) {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		min-width: 0;
	}

	:global(.tabroom-table .table-sort-chevrons) {
		display: inline-flex;
		flex-direction: column;
		gap: 2px;
		margin-top: 1px;
	}

	:global(.tabroom-table .table-sort-chevron) {
		width: 0;
		height: 0;
		border-left: 4px solid transparent;
		border-right: 4px solid transparent;
		opacity: 0.35;
	}

	:global(.tabroom-table .table-sort-chevron-up) {
		border-bottom: 5px solid currentColor;
	}

	:global(.tabroom-table .table-sort-chevron-down) {
		border-top: 5px solid currentColor;
	}

	:global(.tabroom-table .table-sort-chevron-active) {
		opacity: 1;
	}

	:global(.tabroom-table .table-empty-cell) {
		padding: 1.5rem 1rem;
		text-align: center;
		font-size: 0.875rem;
		color: var(--color-neutral-600);
	}

	:global(.tabroom-table .table-error-stack) {
		display: block;
		align-items: center;
		gap: 0.25rem;
		margin: 0.5rem 0;
	}
</style>
