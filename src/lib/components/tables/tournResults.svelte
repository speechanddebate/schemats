<script lang="ts">
	import type { Tourn } from '$indexcards/schemas';
	import showDateRange from '$lib/helpers/dt';
	import type { GridOptions } from '$lib/layouts/grid/svgrid.js';
	import SVGrid from '$lib/layouts/grid/SVGrid.svelte';
	import CalendarCell from './cells/circuitsCalendarCell.svelte';

	let { data }: { data: Tourn[] | null } = $props();

	let columns = $derived.by(() => [
		{
			id: 'id',
			hidden: true,
		},
		{
			id: 'start',
			header: 'Date(s)',
			template : (value  : string, row : Tourn) => {
				return `${showDateRange({
					startDt: new Date(row.start),
					endDt: new Date(row.end),
					mode: 'date',
				}).dateOutput}`;
			},
		},
		{
			id: 'name',
			header: 'Tournament',
		},
		{
			id: 'location',
			header: 'Location',
			template: (value: string, row: Tourn) => {
				const city = row.city?.trim();
				const country = row.country;
				const state = row.state;
				// Online/asynchronous cases
				if (
					city === 'NSDA Campus' ||
					city === 'NSDACampus' ||
					city === 'Online' ||
					city === 'Asynchronous' ||
					city === 'Asynch'
				) {
					return city;
				}
				let loc = city || '';
				if (loc) loc += ', ';
				if (country === 'US') {
					loc += state || '';
				} else {
					loc += (state ? state + ' ' : '') + (country || '');
				}
				return loc;
			},
		},
		{
			id: 'calendar',
			header: 'Results',
			linkFunction: (row: Tourn) => `/invite/${row.id}/results`,
			cell: CalendarCell,
		},
	]);

	let options: GridOptions = {
		title: 'Tournament Results',
		bigTitle: true,
		tableOptions: {
			reorder: true,
		},
	};

	</script>

<div class='px-3 overflow-x-scroll py-3 bg-back wg-full'>
{#if data}
	<SVGrid
		columns={columns}
		data={data}
		options={options}
	/>
{/if}
</div>
