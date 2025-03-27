<script lang='ts'>

	/**  This was an abortive attempt at something until I realized I was
	 * essentially making a wrapper over a wrapper and ... why not just edit
	 * the one wrapper?
	 */

	/* Can't do that, it would be smart! */

    import { AgGrid } from '$lib/grid';

	import {
		type GridOptions,
		type Module,
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
		themeBalham,
		ValidationModule,
	} from 'ag-grid-community';

	import CsvIcon from 'flowbite-svelte-icons/FileCsvOutline.svelte';

	interface Props {
		data     : [any],
		header?  : string,
		options? : object,
	}

	let { data, header, options }: Props = $props();

	let quickFilterText = $state(undefined);
	let rowData = $state(data);

	let gridOptions: GridOptions<any> = $state<GridOptions<any>>({
		domLayout                  : 'autoHeight',
		pagination                 : true,
		paginationPageSizeSelector : [10, 50, 64, 100, 200],
		paginationPageSize         : 64,
		rowHeight                  : 24,
		getRowId                   : (params) => params.data.id,
		theme                      : themeBalham.withParams({
			accentColor : '#fec937',
		}),

		defaultColDef : {
			enableCellChangeFlash : true,
			autoHeight            : true,
		},
		autoSizeStrategy : {
			type         : 'fitCellContents',
		},
		suppressDragLeaveHidesColumns: true,
		...options,
	});

	const modules: Module[] = [
		ClientSideRowModelModule,
		ColumnApiModule,
		PaginationModule,
		ColumnAutoSizeModule,
		HighlightChangesModule,
		RowAutoHeightModule,
		TextFilterModule,
		NumberFilterModule,
		DateFilterModule,
		CustomFilterModule,
		CellStyleModule,
		TooltipModule,
	];

	if (import.meta.env.MODE === 'development') {
		modules.push(ValidationModule);
	}

</script>

<div>
	<div class='flex w-full flex-col items-center justify-center'>
		<div
			class='md:md-2 mb-0 flex w-full flex-col items-center
			justify-center md:mt-4 md:mb-2 md:w-full md:flex-row md:flex-wrap'
		>
			<span class='w-1/2 flex-grow'>
				<h1 class="px-2 text-5xl font-semibold text-black">
					{ header || 'Tournament Data' }
				</h1>
			</span>
			<span class='w-1/5 text-right'>
				<input
					bind:value  = '{quickFilterText}'
					class       = 'form-input p-1 italic text-sm rounded'
					placeholder = 'Search Table...'
				/>
			</span>

			<span
				class='w-1/8 text-right ml-4 mr-4 border-2 border-green-700 rounded p-[2px]'
				title='Download CSV of this table'
			>
				<CsvIcon
					class    = 'hover:cursor-pointer dark:text-white text-green-700'
					id       = 'csvExportTrigger'
					onclick  = { () => { sole.log() } }
					size     = 'md'
				/>
			</span>
		</div>

		<div class='w-screen md:m-2 md:w-full'>
			<AgGrid
				{gridOptions}
				{modules}
				{quickFilterText}
				{rowData}
			/>
		</div>
	</div>
</div>
