<script lang='js'>
// @ts-nocheck

// Yeah I disabled it hwen I realized I was chasing down TS errors more than the
// errors they are supposed to prevent.  I am unworthy of my ancestors and will
// forever know my shame --CLP

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
		createGrid,
	} from 'ag-grid-community';

	import { onMount } from 'svelte';
	import SvelteFrameworkOverrides from './SvelteFrameworkOverrides.svelte';
	import initialGridOptionsList from './initialGridOptionsSet';
	import CsvIcon from 'flowbite-svelte-icons/FileCsvOutline.svelte';

	let { data, options, themeOptions } = $props();

	let quickFilterText = $state(undefined);
	let rowData = $state(data);

	let gridOptions = $state({
		domLayout                  : 'autoHeight',
		autoSizeStrategy : {
			type: 'fitCellContents',
			defaultMinWidth: 64,
		},
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
			oddRowBackgroundColor          : '#fafafa',
			columnBorder                   : false,
			accentColor                    : '#fec937',
			fontFamily                     : 'IBMPlexSans',
			fontSize                       : 12,
			wrapperBorderRadius            : 0,
		}),

		defaultColDef : {
			enableCellChangeFlash : true,
			autoHeight            : true,
			flex                  : 2,
		},
		onGridReady: () => {
//			api?.autoSizeAllColumns();
		},
		onGridSizeChanged : () => {
//			api?.autoSizeAllColumns();
		},
		suppressDragLeaveHidesColumns     : true,
		suppressHorizontalScroll          : false,
		cacheQuickFilter                  : true,
		includeHiddenColumnsInQuickFilter : true,
		...options,
	});

	const modules = [
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

	let api = $state(undefined);
	let divContainerEl = $state();

	const gridParams = {
		modules            : modules ?? [],
		frameworkOverrides : new SvelteFrameworkOverrides(),
	};

	$effect(() => {
		const updatedOptions = {};

		for (const key in gridOptions) {
			if (!initialGridOptionsList.has(key)) {
				updatedOptions[key] = gridOptions[key];
			}
		}
		api?.updateGridOptions(updatedOptions);
	});

	// Update grid on data change + init
	$effect(() => {
		try {
			api?.setGridOption('rowData', rowData);
		} catch(err) {
			console.log(`Error on the AG grid load ${err}`);
		}
	});

	$effect(() => {
		if (quickFilterText !== undefined) {
			api?.setGridOption('quickFilterText', quickFilterText);
		}
	});

	onMount(() => {
		api = createGrid(divContainerEl, gridOptions, gridParams);
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
			class = '
				flex w-full flex-col
				items-center justify-center
				md:mt-5
				md:w-full md:flex-row md:flex-wrap
				md:md-2
			'
		>
			<span class='w-1/2 grow xl:pb-2 md:pb-1 ps-2'>
				<h1 class="px-1 text-5xl md:text-3xl font-semibold text-black mt-2">
					{ themeOptions?.header || 'Results' }
				</h1>
			</span>

			<span
				class='w-1/2 bg-back flex py-2 mt-2
					rounded-t-sm
					items-center text-align-right
					border-b-back
				'
			>
				<span class='w-3/4 text-right grow px-2 ps-4'>
					<input
						class       = 'form-input py-1 px-2 italic text-xs rounded-sm w-full'
						placeholder = '{ themeOptions?.searchText || 'Search Table...'}'
						bind:value  = {quickFilterText}
					/>
				</span>

				<span class='px-4 text-right flex'>
					<span
						class='
							border-2 border-green-700 rounded-sm p-[2px]
							bg-back
						'
						title='Download CSV of this table'
					>
						<CsvIcon
							id       = 'csvExportTrigger'
							class    = 'hover:cursor-pointer dark:text-white text-green-700
								hover:text-white dark:hover:text-green-700
								hover:bg-green-700
								lg:h-5 lg:w-5
								md:h-4 md:w-4'
							onclick  = { () => { csvExport(); } }
						/>
					</span>
				</span>
			</span>

		</div>

		<div class = 'w-screen
			md:mx-2 md:w-full
			bg-back
			px-2 pt-2 pb-4
			rounded-tl-md
		'>
			<div
				bind:this = {divContainerEl}
				style     = {themeOptions?.gridStyle}
				class     = {themeOptions?.gridClass ?? 'ag-theme-quartz'}
			></div>
		</div>
	</div>
</div>
