<script lang='ts'>

    import { Pager } from '@svar-ui/svelte-core';
	import {
		Grid,
		Willow,
		HeaderMenu,
        type IColumn,
	} from '@svar-ui/svelte-grid';
	import { Button } from 'flowbite-svelte';
	import Papa from 'papaparse';

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
	};

	$inspect('Original Columns');
	$inspect(columns);

	let optionedColumns = $derived.by(() => {
		return columns.map( (col:IColumn) => {
			return {
				...defaultOptions,
				...col,
			};
		});
	});

	$inspect('Processed Columns');
	$inspect(optionedColumns);

	// Pager Functions at the bottom

	// Shut up, dweeb.
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

	// svelte-ignore state_referenced_locally
	setPage({ from: 0, to: limit });

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

	// Export to JSON and CSV

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

</script>

<div class='p-4 tabroomStyled'>

	<div class="flex">
		<span class="w-1/3">
			<h4>{options.title || 'Data' }</h4>
		</span>

		<span class="w-2/3 parent-toolbar text-right">
			<Button
				onclick={() => printPortrait()}
			>Port</Button>

			<Button
				onclick={() => printLandscape()}
			>Land</Button>

			<Button
				onclick={() => csvGrid()}
			>CSV</Button>
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

		<Pager
			onchange = {setPage}
			pageSize = {limit}
			total    = {data.length}
		/>
	</Willow>
</div>

<style>
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
