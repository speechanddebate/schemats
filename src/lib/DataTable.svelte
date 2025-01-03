<script lang='ts'>

	import {TabulatorFull as Tabulator} from 'tabulator-tables';
	import {onMount} from 'svelte';
	import type { TabulatorFull } from 'tabulator-tables';

	interface Props {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		data?: any[];
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		columns?: any[];
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		options?: any;
	}

	let {
		data    = [],
		columns = [],
		options = {}
	}: Props = $props();

	/**@type {import('tabulator-tables').Tabulator}*/
	let tableObject : TabulatorFull;

	let tableRef : HTMLDivElement;

	onMount(() => {

		if (data) {
			tableObject = new Tabulator(tableRef, {
				data    ,
				columns ,
				layout             : 'fitColumns' , //fit columns to width of table
				addRowPos          : 'top'        , //when adding a new row add it to the top of the table
				paginationSize     : 50           , //allow 7 rows per page of data
				pagination         : true         , //paginate the data
				paginationCounter  : 'rows'       , //display count of paginated rows in footer
				responsiveLayout   : 'hide'       , //hide columns that don't fit on the table
				movableColumns     : true         , //allow column order to be changed
				resizableColumnFit : true,
			});
		} else {
			tableObject = new Tabulator(tableRef, {
				layout            : 'fitColumns' , //fit columns to width of table
				responsiveLayout  : 'hide'       , //hide columns that don't fit on the table
				addRowPos         : 'top'        , //when adding a new row add it to the top of the table
				paginationSize    : 50           , //allow 7 rows per page of data
				pagination        : true         , //paginate the data
				paginationCounter : 'rows'       , //display count of paginated rows in footer
				movableColumns    : true         , //allow column order to be changed
			});
		}

		return () => tableObject.destroy();
	});

</script>

	<div style="text-align: right; padding-bottom: 4px;">
		<button onclick={ () => { tableObject.download('csv', options.filename || 'tabroom-data.csv') } } >
			CSV
		</button>
	</div>

	<div bind:this={tableRef}></div>

	<svelte:head>
		<link href="/css/tabulator.min.css" rel="stylesheet">
	</svelte:head>
