<script lang='ts'>

	/**
	 *  This agGrid wrapper was taken wholesale from the 
	 */
    import { AgGrid } from '$lib/grid/';
    import csvExport from '$lib/grid/AgGrid.svelte';

	import { type GridOptions, type Module } from '@ag-grid-community/core';
	import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
	import { themeBalham } from '@ag-grid-community/theming';
	import CsvIcon from 'flowbite-svelte-icons/FileCsvOutline.svelte';

	/* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
	type TData = Array<any>;

	interface Props {
		data     : TData,
		header?  : string,
		options? : object,
	}

	let { data, header, options }: Props = $props();

	let quickFilterText = $state(undefined);
	let rowData = $state(data);

	let gridOptions: GridOptions<TData> = $state<GridOptions<TData>>({
		...options,
		domLayout                  : 'autoHeight',
		loadThemeGoogleFonts       : false,
		pagination                 : true,
		paginationPageSizeSelector : [50, 100, 200],
		paginationPageSize         : 100,
		rowHeight                  : 24,
		getRowId                   : (params) => params.data.id.toString(),

		theme: themeBalham.withParams({
			accentColor : '#fec937',
		}),
		defaultColDef : {
			enableCellChangeFlash : true,
			suppressMovable       : true,
			autoHeight            : true,
		},
		autoSizeStrategy : {
			type         : 'fitCellContents',
		},

	});

//	let period = $state(1600);

/*	$effect(() => {
		const interval = setInterval(() => {
			gridOptions.theme = themeBalham.withParams({
				accentColor: `#${Math.floor(Math.random() * 16777215)
					.toString(16)
					.padStart(6, '0')}`,
			});
		}, period);
		return () => clearInterval(interval);
	});
*/

	const modules: Module[] = [ClientSideRowModelModule];

</script>

<div>
	<div class='flex w-full flex-col items-center justify-center'>
		<div
			class='md:md-2 mb-0 flex w-full flex-col items-center
			justify-center md:mt-4 md:mb-2 md:w-[96vw] md:flex-row md:flex-wrap'
		>
			<span class='w-1/2 flex-grow'>
				<h1 class="px-2 text-5xl font-semibold text-black">
					{ header || 'Tournament Data' }
				</h1>
			</span>
			<span class='w-1/5 text-right'>
				<input
					class       = 'form-input p-1 italic text-sm'
					placeholder = 'Search Table...'
					bind:value  = {quickFilterText}
				/>
			</span>

			<span 
				class='w-1/8 text-right ml-4 mr-4 border border-green-700 rounded p-1'
				title='Download CSV of this table'
			>
				<CsvIcon
					class = 'hover:cursor-pointer dark:text-white text-green-700'
					onclick = {() => csvExport()}
					size    = 'md'
				/>
			</span>
		</div>

		<div class='w-screen md:m-2 md:w-[95vw] md:max-w-[95vw]'>
			<AgGrid
				{gridOptions}
				{modules}
				{quickFilterText}
				{rowData}
			/>
		</div>
	</div>
</div>
