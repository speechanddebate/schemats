<script lang='ts'>

    import { Pager } from '@svar-ui/svelte-core';

    import {
		FilterBar,
		createFilter,
		getOptions
	} from '@svar-ui/svelte-filter';

	import {
		Grid,
		Willow,
		HeaderMenu,
	} from '@svar-ui/svelte-grid';

	import { Button, Tooltip } from 'flowbite-svelte';
	import Papa from 'papaparse';
	import CsvIcon from 'flowbite-svelte-icons/FileCsvOutline.svelte';
	import PrinterOutline from 'flowbite-svelte-icons/PrinterOutline.svelte';
	import DatabaseOutline from 'flowbite-svelte-icons/DatabaseOutline.svelte';
	import ArchiveOutline from 'flowbite-svelte-icons/ArchiveOutline.svelte';

    import type { IColumn } from '@svar-ui/svelte-grid';
    import { ucfirst } from '$lib/helpers/text';

	let { data, columns, options } = $props();

	interface PageRange {
		from : number,
		to   : number,
	};

	let limit = $derived(options.limit || import.meta.env.VITE_TOURN_LIMIT || 128);

	// Defaults
	const sizes = {
		headerHeight : 25,
		rowHeight    : 25,
	};

	const defaultOptions = {
		sort     : true,
		resize   : true,
		flexgrow : 1,
		width    : 64,
	};

	// In theory SVARGrid does this when you pass these options to them as
	// autoConfig={thing} but in practice?  Not so much.

	let optionedColumns = $derived.by(() => {
		return columns.map( (col:IColumn) => {
			return {
				...defaultOptions,
				...col,
			};
		});
	});

	// Pager Functions at the bottom
	// Shut up, Typescript dweebs.

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let pagedData:any[] = $state([]);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let api = $state< any | undefined>();

	const setPage = (event:PageRange) => {
		const { from, to } = event;
		if (data) {
			pagedData = data.slice(from, to);
		} else {
			pagedData = [];
		}
	};

	// Sets the initial range of the pager
	// svelte-ignore state_referenced_locally
	setPage({ from: 0, to: limit });

	// Filter search function
	let filterId = $state(1);

	const filterTabs = $derived.by( () => {
		return columns.map( (col:IColumn) => {
			if (col.filter) {
				return {
					id    : col.id,
					label : `By ${ ucfirst(col.id) }`,
				};
			}
		});
	});

	// Printing
	const printPortrait = () => {
		api?.exec('print', {
			paper: options.papersize || 'letter',
			mode: 'portrait',
		});
	};

	const printLandscape = () => {
		api?.exec('print', {
			paper: options.papersize || 'letter',
			mode: 'landscape',
		});
	};

	// Export to CSV
	const csvGrid = async () => {
		const csvData = Papa.unparse(data);
		const blob = new Blob([csvData], {type: 'text/csv;charset=utf-8'});
		const a       = document.createElement('a');
		a.href        = URL.createObjectURL(blob);
		a.download    = options.filename || 'tabroom-export.csv';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	};

	// Export to JSON. You're welcome, nerds.
	const jsonGrid = async () => {
		const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json;charset=utf-8'});
		const a       = document.createElement('a');
		a.href        = URL.createObjectURL(blob);
		a.download    = options.filename || 'tabroom-data.json';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	};

</script>

<div class='px-4 pt-4 bg-back tabroomStyled'>

	<div class="flex">
		{#if options.bigTitle }
			<span class="w-1/2 ps-1">
				<h2 class='font-semibold'>{options.title || 'Data' }</h2>
				{#if options.subTitle}
					<h6>{ options.subTitle }</h6>
				{/if}
			</span>
		{:else}
			<span class="w-1/2 ps-2">
				<h4 class='font-semibold'>{options.title || 'Data' }</h4>
				{#if options.subTitle}
					<h6>{ options.subTitle }</h6>
				{/if}
			</span>
		{/if}

		<span class="w-1/4 grow border-2 border-gray-500 content-center text-center">
			Fleebles
		</span>

		<span class="w-1/5 pe-2 parent-toolbar text-right flex-1 content-center">

			<Button
				id       = 'JSONExportTrigger'
				class    = '
						border-2
						text-purple-700 bg-white border-purple-700
						hover:cursor-pointer
						hover:bg-purple-700 hover:text-white hover:border-white
						px-[3px] py-1 m-0
						h-auto w-auto
				'
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
				id       = 'PrintPortaitTrigger'
				class    = '
						border-2
						hover:bg-red-700 hover:text-white hover:border-white
						hover:cursor-pointer
						text-red-700 bg-white border-red-700
						px-[3px] py-1 m-0
						h-auto w-auto
						'
				onclick={() => printPortrait()}
			>
				<PrinterOutline
					size='sm'
				/>
			</Button>
			<Tooltip>
				Print Portait Mode
			</Tooltip>

			<Button
				id       = 'PrintLandscapeTrigger'
				class    = '
						border-2
						hover:bg-blue-700 hover:text-white hover:border-white
						hover:cursor-pointer
						text-blue-700 bg-white border-blue-700
						px-[3px] py-1 m-0
						h-auto w-auto
					'
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
						px-[3px] py-1 m-0
						h-auto w-auto
						'
				onclick={() => csvGrid()}
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
			<Grid
				bind:this={api}
				columns = {optionedColumns}
				data   = {pagedData}
				{...options}
				{sizes}
			/>
		</HeaderMenu>

		<div class='flex justify-around pager-toolbar'>
			<Pager
				onchange = {setPage}
				pageSize = {limit}
				total    = {data.length}
			/>
		</div>
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

	:global(.tabroomStyled .wx-willow-theme) {

		--wx-table-select-background       : #eaedf5;
		--wx-table-select-focus-background : #ebedf3;
		--wx-table-select-color            : var(--wx-color-font);
		--wx-table-select-border           : inset 3px 0 var(--wx-color-primary);

		--wx-table-header-background  : var(--color-secondary-100);
		--wx-table-header-border      : 1px solid var(--color-secondary-400);
		--wx-table-header-cell-border : var(--wx-table-header-border);
		--wx-header-font-weight       : 600;

		--wx-table-cell-border               : var(--wx-table-border);
		--wx-table-fixed-column-right-border : 3px solid #e6e6e6;
		--wx-table-editor-dropdown-border    : var(--wx-table-border);
		--wx-table-editor-dropdown-shadow    : 0px 4px 20px 0px    rgba(44, 47, 60, 0.12);

		--wx-font-family : "IBM Plex Sans";
		--wx-font-size   : 12px;
		--wx-color-font  : var(--color-neutral-950);

		border-left  : 1px solid var(--color-neutral-400);
		border-right : 1px solid var(--color-neutral-400);
		padding-right: 1px;
	}

    :global(.tabroomStyled .wx-willow-theme) {
		border-radius: 4px;
	}

    :global(.tabroomStyled .wx-grid) {
		padding-top : 0;
		border-radius: 4px;
	}

    :global(.tabroomStyled .wx-grid .wx-table-box) {
		border-right: none;
		border-top  : 1px solid var(--color-secondary-600);
		border-radius: 4px;
		margin-top  : -1px;
	}

    :global(.tabroomStyled .wx-grid .wx-header .wx-cell) {
		padding-left   : 1em;
		padding-right  : 1em;
		padding-top    : 0;
		padding-bottom : 0;
		margin-top     : 0px;
	}

    :global(.tabroomStyled .wx-data .wx-row .wx-cell) {
		padding-left   : 1em;
		padding-right  : 1em;
		padding-top    : 0;
		padding-bottom : 0;
		align-content  : center;
	}

	:global(.tabroomStyled .wx-willow-theme .wx-row:nth-of-type(2n)) {
		background-color: var(--color-neutral-100);
	}

	:global(.wx-willow-theme .menu) {
		box-shadow: 0px 4px 20px 0px rgba(44, 47, 60, 0.12);
		outline: 1px solid #e6e6e6;
	}
</style>
