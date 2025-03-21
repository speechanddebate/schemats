<script generics='gTData' lang='ts'>

	/**
	 * This agGrid wrapper was largely taken wholesale from
	 * https://github.com/bn-l/ag-grid-svelte5-extended I didn't import it
	 * because it's very new software and might go poof, and because there were
	 * some things I wanted to tweak about it without being confident enough to
	 * do a pull request, but credit where credit is due.
	 */

    import { AgGrid } from '$lib/grid/';
    import csvExport from '$lib/grid/AgGrid.svelte';

	import { type GridOptions, type Module } from '@ag-grid-community/core';
	import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
	import { themeBalham } from '@ag-grid-community/theming';
	import CsvIcon from 'flowbite-svelte-icons/FileCsvOutline.svelte';

	interface Props {
		data     : TData,
		header?  : string,
		options? : object,
	}

	let { data, header, options }: Props = $props();

	let quickFilterText = $state(undefined);
	let rowData = $state(data);

	let gridOptions: GridOptions<TData> = $state<GridOptions<TData>>({

		domLayout                  : 'autoHeight',
		loadThemeGoogleFonts       : false,
		pagination                 : true,
		paginationPageSizeSelector : [10, 50, 64, 100, 200],
		paginationPageSize         : 64,
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
		...options,
	});

	const modules: Module[] = [ClientSideRowModelModule];

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
					class       = 'form-input p-1 italic text-sm rounded'
					placeholder = 'Search Table...'
					bind:value  = '{quickFilterText}'
				/>
			</span>

			<span
				class='w-1/8 text-right ml-4 mr-4 border-2 border-green-700 rounded p-[2px]'
				title='Download CSV of this table'
			>
				<CsvIcon
					class = 'hover:cursor-pointer dark:text-white text-green-700'
					onclick = {() => csvExport()}
					size    = 'md'
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
