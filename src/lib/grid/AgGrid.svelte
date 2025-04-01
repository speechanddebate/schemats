<script lang='ts'>

	import {
		type GridOptions,
		type Module,
		type GridApi,
		type GridParams,
		createGrid,
		type ColDef,
	} from 'ag-grid-community';

	import {
		CsvExportModule,
		ClientSideRowModelModule,
		ColumnApiModule,
		ColumnAutoSizeModule,
		PaginationModule,
		HighlightChangesModule,
		RowAutoHeightModule,
		TextFilterModule,
		NumberFilterModule,
		DateFilterModule,
		CustomFilterModule,
		CellStyleModule,
		TooltipModule,
		themeQuartz,
		QuickFilterModule,
		ValidationModule,
	} from 'ag-grid-community';

	import { onMount } from 'svelte';
	import SvelteFrameworkOverrides from './SvelteFrameworkOverrides.svelte';
	import initialGridOptionsList from './initialGridOptionsSet';
	import CsvIcon from 'flowbite-svelte-icons/FileCsvOutline.svelte';

	export interface TableOptions extends GridOptions {
		columnDefs	 : ColDef[],
		fileName?    : string,
		header?      : string,
		searchText?  : string,
		searchStyle? : string,
		gridStyle?   : string,
		gridClass?   : string,
	}

	interface Props {
		data      : object[],
		options?  : TableOptions,
	}

	let { data, options }: Props = $props();

	let quickFilterText = $state(undefined);
	let rowData = $state(data);

	let gridOptions:GridOptions = $state({
		domLayout                  : 'autoHeight',
		pagination                 : true,
		paginationPageSizeSelector : [10, 50, 64, 100, 200],
		paginationPageSize         : 64,
		rowHeight                  : 24,
		getRowId                   : (params) => {
			return params.data?.id;
		},
		theme                      : themeQuartz.withParams({

			headerTextColor                : '#013649',
			headerBackgroundColor          : '#fff7e1',
			headerCellHoverBackgroundColor : '#ffe9af',
			headerColumnBorderHeight       : '100%',
			headerColumnResizeHandleColor  : '#e59058',
			headerColumnResizeHandleHeight : '25%',
			headerColumnResizeHandleWidth  : '2px',
			headerHeight                   : '30px',
			columnBorder                   : false,
			accentColor                    : '#fec937',
		}),

		defaultColDef : {
			enableCellChangeFlash : true,
			autoHeight            : true,
		},
		autoSizeStrategy : {
			type         : 'fitCellContents',
			skipHeader   : false,
		},
		suppressDragLeaveHidesColumns     : true,
		cacheQuickFilter                  : true,
		includeHiddenColumnsInQuickFilter : true,
		...options,
	});

	const modules: Module[] = [
		CsvExportModule,
		ClientSideRowModelModule,
		ColumnApiModule,
		PaginationModule,
		ColumnAutoSizeModule,
		HighlightChangesModule,
		RowAutoHeightModule,
		TextFilterModule,
		NumberFilterModule,
		DateFilterModule,
		QuickFilterModule,
		CustomFilterModule,
		CellStyleModule,
		TooltipModule,
	];

	if (import.meta.env.MODE === 'development') {
		modules.push(ValidationModule);
	}

	let api: GridApi | undefined = $state(undefined);
	let divContainerEl: HTMLDivElement | undefined = $state();

	const gridParams: GridParams = {
		modules            : modules ?? [],
		frameworkOverrides : new SvelteFrameworkOverrides(),
	};

	$effect(() => {
		const updatedOptions: GridOptions = {};

		for (const key in gridOptions) {
			if (!initialGridOptionsList.has(key)) {
				updatedOptions[key as keyof GridOptions] = gridOptions[key as keyof GridOptions];
			}
		}

		api?.updateGridOptions(updatedOptions);
	});

	// Update grid on data change + init
	$effect(() => {
		api?.setGridOption('rowData', rowData);
		api?.sizeColumnsToFit();
	});

	$effect(() => {
		if (quickFilterText !== undefined) {
			api?.setGridOption('quickFilterText', quickFilterText);
		}
	});

	onMount(() => {
		api = createGrid(divContainerEl!, gridOptions, gridParams);
		api.sizeColumnsToFit();
		return () => {
			api?.destroy();
		};
	});

	export const csvExport = () => {
		api?.exportDataAsCsv({
			allColumns : true,
			fileName   : options?.fileName || 'tabroom-export.csv',
		});
	};

</script>

<div>
	<div class='flex w-full flex-col items-center justify-center'>
		<div
			class='md:md-2 mb-0 flex w-full flex-col items-center
			justify-center md:mt-4 md:mb-2 md:w-full md:flex-row md:flex-wrap'
		>
			<span class='w-2/5 flex-grow'>
				<h1 class="px-1 text-5xl font-semibold text-black">
					{ options?.header || 'Tournament Data' }
				</h1>
			</span>
			<span class='w-1/4 text-right'>
				<input
					class       = 'form-input py-1 px-2 italic text-xs rounded w-full'
					placeholder = '{ options?.searchText || 'Search Table...' }'
					bind:value  = {quickFilterText}
				/>
			</span>

			<span
				class='w-1/8 text-right ml-4 mr-4 border-2 border-green-700 rounded p-[2px]'
				title='Download CSV of this table'
			>
				<CsvIcon
					id       = 'csvExportTrigger'
					class    = 'hover:cursor-pointer dark:text-white text-green-700'
					onclick  = { () => { csvExport(); } }
					size     = 'md'
				/>
			</span>
		</div>

		<div class='w-screen md:m-2 md:w-full'>
			<div
				bind:this = {divContainerEl}
				style     = {options?.gridStyle}
				class     = {options?.gridClass ?? 'ag-theme-quartz'}
			></div>
		</div>
	</div>
</div>
