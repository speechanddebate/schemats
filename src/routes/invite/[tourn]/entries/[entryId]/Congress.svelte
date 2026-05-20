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

	const congressColumns: SchematColumn[] = $derived.by( () => {

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

		if (event.Settings?.autoRecency) {
			columns.push({
				id          : 'speakerOrder',
				header      : 'Recency',
				columnClass : 'text-center',
				flexgrow    : 0,
				width       : 128,
				template    : (_value, row:IRow) => {
					return ordinate(row.speakerOrder) || '';
				},
			});
		}

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

		for (const tag of ['winloss', 'rank', 'point', 'refute', 'po', 'speech']) {

			let label = 'W/L';
			let classAlign = 'text-right';
			let cellWidth = 128;

			if (tag === 'refute') label = tag;
			if (tag === 'point') label = 'Points';

			if (tag === 'speech') {
				label = 'Speech Scores';
				classAlign = 'text-center';
			}

			if (tag === 'rank') {
				classAlign = 'text-center';
				label      = 'Rank';
				cellWidth  = 72;
			}

			if (tag === 'po') {
				label      = 'Presided';
				classAlign = 'text-center font-semibold';
				cellWidth  = 72;
			}

			if (event.scoreTags[tag]) {
				columns.push({
					id           : `record_${tag}`,
					header       : label,
					flexgrow     : 0,
					width        : cellWidth,
					cell         : Score,
					elementClass : classAlign,
					key          : tag,
				});
			}
		}

		return columns;
	});

	const options : GridOptions = {
		title         : 'Chambers & Results',
		bigTitle      : false,
		noPager       : true,
		noFilter      : true,
		tableOptions  : {
			cellStyle : (row:IRow, col:IColumn) => (col.id == 'sideLabel' ? 'text-center' : ''),
		},
	};

</script>

	<SVGrid
		columns = { congressColumns }
		data    = { resultsTable }
		options = { options }
	/>
