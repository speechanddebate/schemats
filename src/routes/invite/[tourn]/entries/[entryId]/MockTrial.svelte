<script lang='ts'>

	import { getContext } from 'svelte';
    import CellLink from '$lib/layouts/CellLink.svelte';
    import SVGrid from '$lib/layouts/grid/SVGrid.svelte';
	import type { SchematColumn } from '$lib/layouts/grid/svgrid.d.ts';

	import type { GridOptions } from '$lib/layouts/grid/svgrid';
	import Panel from './Panel.svelte';
	import Entry from './Entry.svelte';

	let { entry } = $props();
	import type { Tourn } from '$indexcards/schemas';
    import type { IColumn, IRow } from '@svar-ui/svelte-grid';
	let tourn:Tourn = getContext('webnameTourn');

	let resultsTable = $derived.by(  () => {
		return Object.keys(entry.Rounds).map( (round) => {
			return entry.Rounds[round];
		});
	});

	let event = $derived( entry.Event );
	const roundLink = (row:IRow) => { return `/invite/${tourn.webname}/rounds/${ event?.abbr }/${ row.name }`; };

	const debateColumns: SchematColumn[] = [
		{
			id           : 'label',
			cell         : CellLink,
			linkFunction : roundLink,
			header       : 'Round',
			flexgrow     : 0,
			width        : 80,
			sort         : (a:IRow, b:IRow) => {
				if (a.name - b.name > 0) return -1;
				if (a.name - b.name < 0) return 1;
				return 0;
			},
		},{
			id        : 'sideLabel',
			header    : 'Side',
			flexgrow  : 0,
			width     : 64,
		},
	];

	$effect( () => {
		if (!entry.Event.mode || entry.Event.mode === 'sync') {
			debateColumns.push({
				id        : 'room',
				header    : 'Room',
				flexgrow  : 0,
				width     : 180,
			});
		}
	});

	debateColumns.push({
		id       : 'opponent',
		header   : 'Opponent',
		cell     : Entry,
		key      : 'code',
		flexgrow : 1,
		width    : 128,
	});

	debateColumns.push({
		id       : 'primary',
		cell     : Panel,
		header   : 'W/L',
		flexgrow : 0,
		style    : 'text-center',
		width    : 64,
	});

	const options : GridOptions = {
		title         : 'Results By Round',
		bigTitle      : false,
		noPager       : true,
		noFilter      : true,
		tableOptions  : {
			cellStyle : (row:IRow, col:IColumn) => (col.id == 'sideLabel' ? 'text-center' : ''),
		},
	};

</script>

	<SVGrid
		columns = { debateColumns }
		data    = { resultsTable }
		options = { options }
	/>

	<pre>
		{ JSON.stringify( tourn, null, 2) }
		{ JSON.stringify( resultsTable, null, 2) }
		{ JSON.stringify( entry, null, 2) }
	</pre>