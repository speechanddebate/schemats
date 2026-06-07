<script lang='ts'>

	import { getContext } from 'svelte';
    import { ordinate } from '$lib/helpers/text';
    import CellLink from '$lib/layouts/CellLink.svelte';
    import SVGrid from '$lib/layouts/grid/SVGrid.svelte';
	import Panel from './Panel.svelte';
	import Score from './Score.svelte';
	import RoomMap from '$lib/layouts/rooms/RoomMap.svelte';

	import type { SchematColumn } from '$lib/layouts/grid/svgrid.d.ts';
	import type { GridOptions } from '$lib/layouts/grid/svgrid';
	import type { Tourn } from '$indexcards/schemas';
    import type { IColumn, IRow } from '@svar-ui/svelte-grid';

	let { entry } = $props();
	let tourn:Tourn = getContext('webnameTourn');

	let resultsTable = $derived.by(  () => {
		return Object.keys(entry.Rounds).map( (round) => {
			const roundResult = entry.Rounds[round];
			roundResult.students = entry.students;
			return roundResult;
		});
	});

	let event = $derived( entry.Event );
	const roundLink = (row:IRow) => { return `/invite/${tourn.webname}/rounds/${ event?.abbr }/${ row.name }`; };

	const debateColumns: SchematColumn[] = $derived.by( () => {

		const columns:SchematColumn[] = [
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
			},
		];

		columns.push({
			id          : 'speakerOrder',
			header      : 'Spoke',
			columnClass : 'text-center',
			flexgrow    : 0,
			width       : 64,
			template    : (_value, row:IRow) => {
				return ordinate(row.speakerOrder) || '';
			},
		});

		if (!event.mode || event.mode === 'sync') {
			columns.push({
				id       : 'room',
				header   : 'Room',
				cell     : RoomMap,
				flexgrow : 0,
				width    : 180,
			});
		}

		columns.push({
			id       : 'judges',
			cell     : Panel,
			key      : 'name',
			header   : 'Judging',
			flexgrow : 1,
			width    : 128,
		});

		for (const tag of ['winloss', 'rank', 'point', 'refute', 'po']) {

			let label = 'W/L';
			if (tag === 'refute') label = tag;
			if (tag === 'po') label = 'PO';
			if (tag === 'rank') label = 'Ranks';
			if (tag === 'point') label = 'Points';

			let classAlign = 'text-right';
			if (tag === 'rank')  classAlign = 'text-center';

			if (event.scoreTags[tag]) {
				columns.push({
					id           : `record_${tag}`,
					header       : label,
					flexgrow     : 0,
					width        : 64,
					cell         : Score,
					elementClass : classAlign,
					key          : tag,
				});
			}
		}

		return columns;
	});

	const options : GridOptions = {
		title         : 'Pairings & Results By Round',
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

