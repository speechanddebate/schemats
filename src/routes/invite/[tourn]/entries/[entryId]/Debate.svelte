<script lang='ts'>
	let { entry } = $props();
    import { ordinate } from '$lib/helpers/text';
    import SVGrid from '$lib/layouts/grid/SVGrid.svelte';

	import type { GridOptions } from '$lib/layouts/grid/svgrid';
	import Panel from './Panel.svelte';

	const debateColumns = [
		{
			id       : 'label',
			header   : 'Round',
			flexgrow : 0,
			width    : 80,
		},{
			id        : 'sideLabel',
			header    : 'Side',
			flexgrow  : 0,
			width     : 64,
		},
	];

	$effect( () => {
		if (entry.Event.nsda === '104') {
			debateColumns.push({
				id       : 'speakerorder',
				header   : 'Spoke',
				flexgrow : 0,
				width    : 64,
				template : (value, row) => { ordinate(row.speakerorder); },
			});
		}
	});

	debateColumns.push({
		id       : 'judges',
		cell     : Panel,
		style    : 'ps-1',
		key      : 'name',
		header   : 'Judging',
		flexgrow : 1,
		width    : 128,
	});

	debateColumns.push({
		id       : 'primary',
		cell     : Panel,
		key      : 'primary',
		header   : 'W/L',
		flexgrow : 0,
		style    : 'text-center',
		width    : 64,
	});

	const resultsTable = $derived.by(  () => {
		return Object.keys(entry.Rounds).map( (round) => {
			return entry.Rounds[round];
		});
	});

	const options : GridOptions = {
		title         : 'Results By Round',
		bigTitle      : false,
		noPager       : true,
		noFilter      : true,
		tableOptions  : {
			cellStyle : (row, col) => (col.id == 'sideLabel' ? 'text-center' : ''),
		},
	};

</script>

	<SVGrid
		columns = { debateColumns }
		data    = { resultsTable }
		options = { options }
	/>
