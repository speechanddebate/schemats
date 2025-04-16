<script lang='ts'>

	import {
		type GridOptions,
		type Module,
		type GridApi,
		type GridParams,
		createGrid,
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

	export interface ThemeOptions {
		fileName?    : string,
		header?      : string,
		searchText?  : string,
		searchStyle? : string,
		gridStyle?   : string,
		gridClass?   : string,
	}
	interface Props {
		data          : object[],
		options?      : GridOptions,
		themeOptions? : ThemeOptions,
	}

	let { data, options, themeOptions }: Props = $props();

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
		theme: themeQuartz.withParams({
			...themeOptions,
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
			fontFamily                     : 'IBMPlexSans',
			fontSize                       : 12,
		}),

		defaultColDef : {
			enableCellChangeFlash : true,
			autoHeight            : true,
			flex                  : 2,
		},
		autoSizeStrategy    : {
			type            : 'fitProvidedWidth',
			defaultMinWidth : 128,
			skipHeader      : false,
		},
		onGridSizeChanged : () => {
			// api?.sizeColumnsToFit()
			api?.autoSizeAllColumns();
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
	});

	$effect(() => {
		if (quickFilterText !== undefined) {
			api?.setGridOption('quickFilterText', quickFilterText);
		}
	});

	onMount(() => {
		api = createGrid(divContainerEl!, gridOptions, gridParams);
		return () => {
			api?.destroy();
		};
	});

	export const csvExport = () => {
		api?.exportDataAsCsv({
			allColumns : true,
			fileName   : themeOptions?.fileName || 'tabroom-export.csv',
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
				<h1 class="px-1 text-5xl md:text-4xl font-semibold text-black">
					{ themeOptions?.header || 'Tournament Data' }
				</h1>
			</span>
			<span class='w-1/4 text-right'>
				<input
					class       = 'form-input py-1 px-2 italic text-xs rounded w-full'
					placeholder = '{ themeOptions?.searchText || 'Search Table...' }'
					bind:value  = {quickFilterText}
				/>
			</span>

			<span
				class='w-1/8 text-right ml-4 mr-4 border-2 border-green-700 rounded p-[2px]'
				title='Download CSV of this table'
			>
				<CsvIcon
					id       = 'csvExportTrigger'
					class    = 'hover:cursor-pointer dark:text-white text-green-700
						lg:h-6 lg:w-6
						md:h-4 md:w-4'
					onclick  = { () => { csvExport(); } }
				/>
			</span>
		</div>

		<div class='w-screen md:m-2 md:w-full'>
			<div
				bind:this = {divContainerEl}
				style     = {themeOptions?.gridStyle}
				class     = {themeOptions?.gridClass ?? 'ag-theme-quartz'}
			></div>
		</div>
	</div>
</div>
