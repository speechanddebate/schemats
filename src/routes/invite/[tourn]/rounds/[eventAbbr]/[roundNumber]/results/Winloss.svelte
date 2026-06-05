<script lang="ts">

	let {results, tourn}  = $props();

	import SVGrid from '$lib/layouts/grid/SVGrid.svelte';
	import CellLink from '$lib/layouts/CellLink.svelte';

	import Judges from './Judges.svelte';
	import Scores from './Scores.svelte';
	import Votes from './Votes.svelte';

	import type { SchematColumn, GridOptions } from '$lib/layouts/grid/svgrid.js';
    import { ucfirst } from '$lib/helpers/text';

	const columns:Array<SchematColumn> = $derived.by( () => {

		const baseColumns:Array<SchematColumn> = [
			{
				id     : 'letter',
				header : 'ID',
				hidden : true,
				width  : 50,
				filter : false,
			},
		];

		const affLinkFunction = (row:typeof results)=> `/invite/${tourn.webname}/entries/${ row.Entries[1]?.id }`;
		const negLinkFunction = (row:typeof results) => `/invite/${tourn.webname}/entries/${ row.Entries[2]?.id }`;

		baseColumns.push(
			{
				id           : 'affEntry',
				header       : results.Event.Settings?.affLabel || 'Aff',
				flexgrow     : 2,
				cell         : CellLink,
				linkFunction : affLinkFunction,
				textFunction : (row:typeof results) => row.Entries[1]?.code || '',
			},{
				id           : 'negEntry',
				header       : results.Event.Settings?.negLabel || 'Neg',
				flexgrow     : 2,
				cell         : CellLink,
				linkFunction : negLinkFunction,
				textFunction : (row:typeof results) => row.Entries[2]?.code || '',
			}
		);

		if (results.Event.type !== 'mockTrial') {
			baseColumns.push({
				id       : 'judges',
				cell     : Judges,
				key      : 'name',
				header   : 'Judging',
				flexgrow : 1,
				width    : 96,
			});
		}

		baseColumns.push({
			id          : 'winloss',
			cell        : Votes,
			header      : 'Votes',
			columnClass : 'text-center',
			flexgrow    : 0,
		});

		[1, 2].forEach( (side) => {
			let label = results.Event.Settings?.affLabel;
			if (side == 2) label = results.Event.Settings?.negLabel;

			Object.keys(results.scoreTypes).forEach( (tag) => {
				if (tag && tag !== 'winloss')  {
					baseColumns.push({
						id          : `${side}-${tag}`,
						header      : `${label} ${ ucfirst(tag) }s`,
						cell        : Scores,
						columnClass : 'text-center',
						key         : `${side}`,
						flexgrow    : 0,
					});
				}
			});
		});
		return baseColumns;
	});

	// put in MyTourn support here eventually
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const sections:any = $derived.by( () => {
		return Object.keys(results.Sections)
			.sort( (a, b) => {
				if (results.Sections[a].bye !== results.Sections[b].bye) {
					if (results.Sections[b].bye) return -1;
					if (results.Sections[a].bye) return 1;
				}
				return results.Sections[a].Entries[1].code.localeCompare(
					results.Sections[b].Entries[1].code
				);
			})
			.map( (key) => {
				return results.Sections[key];
			});
	});

	const options:GridOptions = $derived({
		title    : `${ results.label || `Round ${results.name} `} Results`,
		bigTitle : false,
		reorder  : true,
		noPager  : true,
		noFilter : true,
	});

</script>

	<div class='px-3 overflow-x-scroll pb-3 bg-back wg-full text-success-600'>

		<SVGrid
			columns = { columns }
			data    = { sections }
			options = { options }
		/>

	</div>
