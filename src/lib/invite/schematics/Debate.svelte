<script lang="ts">

	let {myTourn, roundData}  = $props();

	import { intersection } from '$lib/helpers/text';
	import SVGrid from '$lib/layouts/grid/SVGrid.svelte';
	import Judges from '$lib/invite/schematics/Judges.svelte';
	import type { SchematColumn, GridOptions } from '$lib/layouts/grid/svgrid.js';

	// SORT THOSE SECTIONS!
	let sections = $derived.by( () => {
		const sectionKeys = Object.keys(roundData.Sections);

		return sectionKeys.map( (key) => {

			if (myTourn?.me || myTourn?.mine) {
				['me', 'mine'].forEach( (owner) => {
					roundData.Sections[key][owner] = 0;
					if (intersection(
						myTourn[owner]?.entries,
						roundData.Sections[key].entryIds
					).length) roundData.Sections[key][owner] += 2;
					if (!roundData.Sections[key][owner]) {
						if (intersection(
							myTourn[owner]?.judges,
							roundData.Sections[key].judgeIds
						).length) roundData.Sections[key][owner] += 1;
					}
				});
			}

			// The table structure wants and needs a few flat fields for the
			// search filtering to work properly.

			roundData.Sections[key].affCode = roundData.Sections[key].Entries[1]?.code || '';
			roundData.Sections[key].affId   = roundData.Sections[key].Entries[1]?.id;
			roundData.Sections[key].negCode = roundData.Sections[key].Entries[2]?.code || '';
			roundData.Sections[key].negId   = roundData.Sections[key].Entries[2]?.id;

			roundData.Sections[key].judgeNames = '';
			roundData.Sections[key].judges = '';

			if (roundData.Sections[key].bye) {
				roundData.Sections[key].judges = 'BYE';
			} else {
				Object.keys(roundData.Sections[key]?.Judges).forEach( (judgeId) => {
					const judge = roundData.Sections[key].Judges[parseInt(judgeId)];
					if (judge) {
						if (roundData.Sections[key].judges) roundData.Sections[key].judges += `, `;
						roundData.Sections[key].judges += `${judge.code || '' } ${judge.first || ''} ${judge.last || ''} `;
					}
				});
			}

			return roundData.Sections[key];

		// Thou may blowest it out thine ass, Typescript
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		}).sort( (a:any,b:any) => {
			if (a.me !== b.me) return b.me - a.me;
			if (a.mine !== b.mine) return b.mine - a.mine;
			if (a.flight !== b.flight) return a.flight - b.flight;
			if (a.bracket !== b.bracket) return (a.bracket - b.flight);
			if (a.roomName) return (a.roomName.localeCompare(b.roomName));
			if (a.letter) return (a.letter.localeCompare(b.letter));
		});
	});

	const event = $derived( roundData.Event );

	const columns:Array<SchematColumn> = $derived.by( () => {

		const baseColumns:Array<SchematColumn> = [
			{
				id       : 'roomName',
				header   : 'Room',
				width    : 80,
			},{
				id       : 'affCode',
				header   : event.settings?.affLabel || 'Aff',
				flexgrow : 2,
			},{
				id       : 'negCode',
				header   : event.settings?.affLabel || 'Neg',
				flexgrow : 2,
			},{
				id       : 'judges',
				header   : 'Judging',
				cell     : Judges,
				flexgrow : 1,
				width    : 256,
			},
		];

		if (roundData.flighted > 1) {
			baseColumns.unshift({
				id     : 'flight',
				header : 'Flight',
				width  : 32,
			});
		}

		baseColumns.unshift({
			id     : 'id',
			width  : 50,
			hidden : true,
			filter : false,
		});

		return baseColumns;
	});

	const options:GridOptions = $derived({
		title    : roundData.label || `Round ${roundData.name}`,
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