<script lang="ts">
import type { RestCircuitsActive200Item } from '$indexcards/schemas';
import type { GridOptions } from '$lib/layouts/grid/svgrid.js';
import SVGrid from '$lib/layouts/grid/SVGrid.svelte';
import CalendarCell from './cells/circuitsCalendarCell.svelte';

let { circuitsData }: { circuitsData: RestCircuitsActive200Item[] | null } = $props();


let columns = $derived.by(() => [
	{
		id: 'abbr',
		header: 'Abbr',
		width: 200,
	},
	{
		id: 'name',
		header: 'Name',
		width: 200,
	},
	{
		id: 'state',
		header: 'State',
		width: 25,
	},
	{
		id: 'country',
		header: 'Country',
		width: 25,
	},
	{
		id: 'tournCount',
		header: 'Tournament Count',
		width: 100,
	},
	{
		id: 'calendar',
		header: 'Calendar',
		linkFunction: (row: RestCircuitsActive200Item) => `/circuits/${row.id}/calendar`,
		cell: CalendarCell,
	},
]);

let options: GridOptions = {
	title: 'Circuits on Tabroom',
	bigTitle: true,
	tableOptions: {
		reorder: true,
	},
};

</script>

{#if circuitsData}
<div class='px-3 overflow-x-scroll py-3 bg-back wg-full'>
	<SVGrid
		columns={columns}
		data={circuitsData}
		options={options}
	/>
</div>
{/if}
