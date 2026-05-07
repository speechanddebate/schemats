<script lang="ts">
	let { data = $bindable(),
		columns,
		options = {},
	} : {
		data: unknown[] | null,
		columns: SchematColumn[],
		options?: GridOptions
	} = $props();

    import { Pager } from '@svar-ui/svelte-core';

	import FilterBar from './filterbar/FilterBar.svelte';

	import {
		createFilter,
		type getQueryString,
	} from '@svar-ui/svelte-filter';

	import {
		Grid,
		Tooltip as HoverTip,
		Willow,
		HeaderMenu,
	} from '@svar-ui/svelte-grid';

	import { Button, Tooltip } from 'flowbite-svelte';
	import CsvIcon from 'flowbite-svelte-icons/FileCsvOutline.svelte';
	import PrinterOutline from 'flowbite-svelte-icons/PrinterOutline.svelte';
	import DatabaseOutline from 'flowbite-svelte-icons/DatabaseOutline.svelte';
	import ArchiveOutline from 'flowbite-svelte-icons/ArchiveOutline.svelte';

    import type { IApi, IExportOptions } from '@svar-ui/svelte-grid';

	import type { GridOptions, SchematColumn } from './svgrid';

	interface PageRange {
		from : number,
		to   : number,
	};

	let limit = $derived(options?.limit || 256);

	// Defaults
	const sizes = {
		rowHeight     : 26,
	};

	const defaultTableOptions = {
		autoRowHeight : true,
		reorder       : false,
	};

	let tableOptions = $derived({...defaultTableOptions, ...options?.tableOptions });

	const defaultColumnOptions: Partial<SchematColumn> = {
		sort          : true,
		resize        : true,
		filter        : true,
		flexgrow      : 1,
		width         : 64,
		filterSort    : 50,
	};

	// In theory SVARGrid does this when you pass these options to them as
	// autoConfig={thing} but in practice?  Not so much.

	let optionedColumns: SchematColumn[] = $derived.by(() => {
		return columns.map( (col) => {
			return {
				...defaultColumnOptions,
				...col,
			};
		});
	});

	let api = $state<IApi | undefined>();

	// Pager Functions at the bottom
	let pagedData = $derived(data);

	const setPage = (event:PageRange) => {

		if (options?.noPager) {
			return;
		}

		const { from, to } = event;
		if (data && Array.isArray(data) ) {
			pagedData = data.slice(from, to);
		} else {
			pagedData = [];
		}
	};

	// Sets the initial range of the pager

	// svelte-ignore state_referenced_locally
	setPage({ from: 0, to: limit });

	// Filter searchbar function
	const filterHandler = ( ({value}:{value:getQueryString})  => {
		const filter = createFilter(value);
		api?.exec('filter-rows', { filter });
	});

	const filterColumns = $derived.by( () => {
		return optionedColumns.filter( (col:SchematColumn) => {
			return col.filter;
		}).sort( (a:SchematColumn, b:SchematColumn)  => {
			if (a.filterSort && b.filterSort) {
				if (a.filterSort < b.filterSort) return -1;
				if (a.filterSort > b.filterSort) return 1;
			}
			if (a.id < b.id) return -1;
			if (a.id > b.id) return 1;
			return 0;
		}).map( (col:SchematColumn) => {
			return {
				id      : col.id,
				label   : `${col.filterHeader || col.header}`,
				filter  : 'contains',
				options : col.filterOptions || undefined,
			};
		});
	});

	// Printing
	const printPortrait = () => {
		api?.exec('print', {
			paper: options?.papersize || 'letter',
			mode: 'portrait',
		});
	};

	const printLandscape = () => {
		api?.exec('print', {
			paper: options?.papersize || 'letter',
			mode: 'landscape',
		});
	};

	// Native Export
	const exportCsv = (csvApi:IApi | undefined) => {
		if (!csvApi) return;

		const csvOptions:IExportOptions = {
			format   : 'csv',
			fileName : options?.filename || 'tabroom-export.csv',
			download : true,
			csv      : {
				cols : ',',
			},
		};
		csvApi?.exec('export-data', csvOptions);
	};

	// Export to JSON. You're welcome, nerds. Your price is this really hacky
	// way to deliver it.

	const jsonGrid = async () => {
		const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json;charset = utf-8'});

		const a    = document.createElement('a');
		a.href     = URL.createObjectURL(blob);
		a.download = options?.filename || 'tabroom-data.json';

		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	};
</script>

<!-- begin layouts/grid/SVGrid.svelte here -->

<div class='bg-back tabroomStyled min-h-screen'>
	<div class="flex items-center mb-1">
		{#if !options?.noTitle }
			{#if options?.bigTitle }
				<span class="w-1/2 grow px-1 mx-1">
					<h2 class='font-semibold'>{options?.title || 'Data' }</h2>
					{#if options?.subTitle}
						<h6>{ options?.subTitle }</h6>
					{/if}
				</span>
			{:else}
				<span class="w-1/2 ps-2 grow">
					<h5 class='font-semibold'>{options?.title || 'Data' }</h5>
					{#if options?.subTitle}
						<h6>{ options?.subTitle }</h6>
					{/if}
				</span>
			{/if}
		{/if}

		{#if !options?.noFilter}
			<span class="w-[30%] content-center text-center h-1/2 border border-neutral-300">
				<Willow>
					<FilterBar
						fields={[
							{
								type        : 'dynamic',
								by          : filterColumns,
								placeholder : `Search ${ options?.title || 'Table' }`,
							},
						]}
						onchange = {filterHandler}
					/>
				</Willow>
			</span>
		{/if}

		<span class="w-1/5 pe-2 parent-toolbar text-right flex-2 content-center">
			<Button
				id       = 'JSONExportTrigger'
				class    = '
						border-2
						text-purple-700 bg-white border-purple-700
						hover:cursor-pointer
						hover:bg-purple-700 hover:text-white hover:border-white
						px-0.75 py-1 m-0
						h-auto w-auto
				'
				aria-label="Export JSON Data"
			onclick={() => jsonGrid()}
			>
				<DatabaseOutline
					size='sm'
				/>
			</Button>
			<Tooltip>
				Export JSON Data
			</Tooltip>

			<Button
				id       = 'PrintPortraitTrigger'
				class    = '
						border-2
						hover:bg-red-700 hover:text-white hover:border-white
						hover:cursor-pointer
						text-red-700 bg-white border-red-700
						px-0.75 py-1 m-0
						h-auto w-auto
						'
				aria-label="Print Portrait Mode"
			onclick={() => printPortrait()}
			>
				<PrinterOutline
					size='sm'
				/>
			</Button>
			<Tooltip>
				Print Portrait Mode
			</Tooltip>

			<Button
				id       = 'PrintLandscapeTrigger'
				class    = '
						border-2
						hover:bg-blue-700 hover:text-white hover:border-white
						hover:cursor-pointer
						text-blue-700 bg-white border-blue-700
						px-0.75 py-1 m-0
						h-auto w-auto
					'
				aria-label="Print Landscape Mode"
			onclick={() => printLandscape()}
			>
				<ArchiveOutline
					size='sm'
				/>
			</Button>
			<Tooltip>
				Print Layout Mode
			</Tooltip>

			<Button
				id       = 'CSVExportTrigger'
				class    = '
						border-2
						text-green-700 bg-white border-green-700
						hover:cursor-pointer
						hover:bg-green-700 hover:text-white hover:border-white
						px-0.75 py-1 m-0
						h-auto w-auto
						'
				aria-label="Download CSV Data"
			onclick={() => exportCsv(api)}
			>
				<CsvIcon
					size='sm'
				/>
			</Button>
			<Tooltip>
				Download CSV/Excel Data
			</Tooltip>
		</span>
	</div>
	<Willow>
		<HeaderMenu {api}>
			<HoverTip {api}>
				<Grid
					bind:this = {api}
					columns   = {optionedColumns}
					{sizes}
					bind:data = {pagedData}
					{...tableOptions}
				/>
			</HoverTip>
		</HeaderMenu>
		{#if !options.noPager}
			<div class='flex justify-around pager-toolbar'>
				<Pager
					onchange = {setPage}
					pageSize = {limit}
					total    = {data?.length}
				/>
			</div>
		{/if}
	</Willow>
</div>

<style>

	.pager-toolbar :global(input[type='number']) {
		width      : auto;
		min-width  : 50px;
	}

	.parent-toolbar :global(.tableToolbar) {
		justify-content : right;
		vertical-align  : center;
	}

	:global(.tableToolbar) {
		display: inline;
	}

	/* SVAR is frustrating sometimes and today it is because they hard coded in
	/* the width of this element, so I need an !important to force it --CLP */

	:global(.tabroomStyled .wx-filter-bar) {

		width   : auto !important;
		padding : 4px !important;
	}

	/* Truly Weird Shit™ happens if you do not enable this for SVAR Grids.
	Otherwise I like having the default type for a span be inline-block because
	I'm a heretic. --CLP */

	:global(.tabroomStyled .wx-willow-theme span) {
		display: inline;
	}

	/* I do wish CSS had a prioritization system beyond just !important */
	:global(.tabroomStyled .wx-willow-theme span.hidden) {
		display: none;
	}

	:global(.tabroomStyled .wx-willow-theme) {

		--wx-table-select-background         : #eaedf5;
		--wx-table-select-focus-background   : #ebedf3;
		--wx-table-select-color              : var(--wx-color-font);
		--wx-table-select-border             : inset 3px 0 var(--wx-color-primary);
		--wx-table-header-background         : var(--color-secondary-100);
		--wx-table-header-border             : 1px solid var(--color-secondary-400);
		--wx-table-header-cell-border        : var(--wx-table-header-border);
		--wx-header-font-weight              : 600;
		--wx-table-cell-border               : var(--wx-table-border);
		--wx-table-fixed-column-right-border : 3px solid #e6e6e6;
		--wx-table-editor-dropdown-border    : var(--wx-table-border);
		--wx-table-editor-dropdown-shadow    : 0px 4px 20px 0px rgba(44, 47, 60, 0.12);

		--wx-font-family : "IBM Plex Sans";
		--wx-font-size   : 12px;
		--wx-color-font  : var(--color-neutral-950);

		border-left   : 1px solid var(--color-neutral-400);
		border-right  : 1px solid var(--color-neutral-400);
		padding-right : 1px;
	}

    :global(.tabroomStyled .wx-willow-theme) {
		border-radius: 4px;
	}

    :global(.tabroomStyled .wx-grid) {
		padding-top : 0;
		border-radius: 4px;
	}

    :global(.tabroomStyled .wx-body) {
		background-color: var(--color-neutral-100);
	}

    :global(.tabroomStyled .wx-grid .wx-table-box) {
		border-right  : none;
		border-top    : 1px solid var(--color-secondary-600);
		border-bottom : 1px solid var(--color-secondary-400);
		border-radius : 4px;
		margin-top    : -1px;
	}

    :global(.tabroomStyled .wx-grid .wx-header .wx-cell) {
		padding-left   : 1em;
		padding-right  : 1em;
		padding-top    : 0;
		padding-bottom : 0;
		margin-top     : 0px;
		font-size      : 11px;
	}

    :global(.tabroomStyled .wx-grid .wx-data .wx-cell) {
		line-height  : 12px;
		padding-left : 0.5em;
	}

    :global(.tabroomStyled .wx-grid .wx-header .wx-cell.smallHeader) {
		padding-left    : 2px;
		padding-right   : 2px;
		justify-content : center;
	}

    :global(.tabroomStyled .wx-data .wx-row) {
		min-height     : 26px;
		height         : fit-content;
	}

    :global(.tabroomStyled .wx-data .wx-row.wx-autoheight .wx-cell) {
		word-break     : break-word;
	}

    :global(.tabroomStyled .wx-data .wx-row .wx-cell) {
		padding-left   : 1em;
		padding-right  : 1em;
		padding-top    : 4px;
		padding-bottom : 4px;
		align-content  : center;
		word-break     : break-word;
	}

	:global(.tabroomStyled .wx-data .wx-row .wx-cell.p-1) {
		padding-left   : 2px;
		padding-right  : 2px;
	}

	:global(.tabroomStyled .wx-data .wx-row .wx-cell.p-0) {
		padding-left   : 0;
		padding-right  : 0;
	}

	:global(.tabroomStyled .wx-willow-theme .wx-row:nth-of-type(2n)) {
		background-color: var(--color-neutral-100);
	}

	:global(.wx-willow-theme .menu) {
		box-shadow : 0px 4px 20px 0px rgba(44, 47, 60, 0.12);
		outline    : 1px solid #e6e6e6;
	}

	:global(.tabroomStyled .wx-row.wx-autoheight .wx-cell.whitespace-nowrap) {
		white-space: nowrap;
	}

</style>
