<script lang="ts">

	let {myTourn, schematic, tourn}  = $props();

	import { intersection } from '$lib/helpers/text';
	import RoomMap from '$lib/layouts/rooms/RoomMap.svelte';

	import CellLink from '$lib/layouts/CellLink.svelte';
	import SVGrid from '$lib/layouts/grid/SVGrid.svelte';
	import Judges from './Judges.svelte';
	import type { SchematColumn, GridOptions } from '$lib/layouts/grid/svgrid.js';

	// SORT THOSE SECTIONS!
	let sections = $derived.by( () => {

		const sectionKeys = Object.keys(schematic.Sections);
		return sectionKeys.map( (key) => {

			const section = schematic.Sections[key];

			if (myTourn?.me || myTourn?.mine) {
				['me', 'mine'].forEach( (owner) => {
					section[owner] = 0;
					if (intersection(
						myTourn[owner]?.entries,
						Object.keys(section.Entries)
					).length) section[owner] += 2;
					if (!section[owner]) {
						if (intersection(
							myTourn[owner]?.judges,
							Object.keys(section.Judges)
						).length) section[owner] += 1;
					}
				});
			}

			// The table structure wants and needs a few flat fields for the
			// search filtering to work properly.

			section.affCode = section.Entries[1]?.code || '';
			section.affId   = section.Entries[1]?.id;
			section.negCode = section.Entries[2]?.code || '';
			section.negId   = section.Entries[2]?.id;

			section.affRecord  = section.Entries[1]?.record;
			section.affWins    = section.Entries[1]?.wins;
			section.negRecord  = section.Entries[2]?.record;
			section.negWins    = section.Entries[2]?.wins;

			section.judges = '';

			if (section.bye) {
				section.judges     = 'BYE';
			} else {
				Object.keys(section?.Judges).forEach( (judgeId) => {
					const judge = section.Judges[parseInt(judgeId)];
					if (judge) {
						if (section.judges) section.judges += `, `;
						section.judges += `${judge.code || '' } ${judge.first || ''} ${judge.last || ''} `;
					}
				});
			}

			return section;

		// Thou may blowest it out thine ass, Typescript. also JS sorting is kinda clunky.
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		}).sort( (a:any,b:any) => {
			// First if I am involved or my school is, pop to the top
			if (a.me !== b.me) return b.me - a.me;
			if (a.mine !== b.mine) return b.mine - a.mine;

			// If there are public bracket data then sort by it, descending order
			if (a.bracket !== b.bracket) return (b.bracket - a.flight);

			// Let's not shame a bye and put them at the very top.
			if (a.bye !== b.bye) return a.bye - b.bye;

			// Flight 1 comes first.
			if (a.flight !== b.flight) return a.flight - b.flight;

			// Otherwise, room name is fine, or section if there isn't a room.
			if (a.roomName) return (a.roomName.localeCompare(b.roomName));
			if (a.letter) return (a.letter.localeCompare(b.letter));
		});
	});

	const event = $derived( schematic.Event );

	const columns:Array<SchematColumn> = $derived.by( () => {

		let affLinkFunction;
		let negLinkFunction;

		if (!schematic.Event.Settings.anonymousPublic) {
			negLinkFunction = (row:typeof schematic) => `/invite/${tourn.webname}/entries/${ row.negId }`;
			affLinkFunction = (row:typeof schematic) => `/invite/${tourn.webname}/entries/${ row.affId }`;
		}

		const baseColumns:Array<SchematColumn> = [
			{
				id     : 'id',
				width  : 50,
				hidden : true,
				filter : false,
			},
		];

		if (sections[1].bracket) {
			baseColumns.push({
				id          : 'bracket',
				header      : 'Bkt',
				width       : 48,
				columnClass : 'text-center',
				flexgrow    : 0,
			});
		}

		if (schematic.flighted > 1) {
			baseColumns.push({
				id          : 'flight',
				header      : 'Flt',
				width       : 48,
				columnClass : 'text-center',
				flexgrow    : 0,
			});
		}

		if (
			schematic.Settings.useNormalRooms
			|| schematic.Event.Settings.onlineMode == 'sync'
			|| !schematic.Event.Settings.onlineMode
		) {
			baseColumns.push({
				id       : 'roomName',
				header   : 'Room',
				cell     : RoomMap,
				width    : 128,
				flexgrow : 1,
			});
		}

		baseColumns.push(
			{
				id           : 'affCode',
				header       : event.Settings?.affLabel || 'Aff',
				flexgrow     : 2,
				cell         : CellLink,
				linkFunction : affLinkFunction,
			},{
				id           : 'negCode',
				header       : event.Settings?.negLabel || 'Neg',
				flexgrow     : 2,
				cell         : CellLink,
				linkFunction : negLinkFunction,
			},{
				id       : 'judges',
				header   : 'Judging',
				cell     : Judges,
				flexgrow : 1,
				width    : 160,
			},
		);

		return baseColumns;
	});

	const options:GridOptions = $derived({
		title    : schematic.label || `Round ${schematic.name}`,
		bigTitle : false,
		reorder  : true,
		noPager  : true,
	});

</script>

	<div class='px-3 overflow-x-scroll pb-3 bg-back wg-full'>
		<SVGrid
			columns   = { columns }
			options   = { options }
			bind:data = { sections }
		/>
	</div>