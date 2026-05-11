<script lang="ts">
	import type { Tourn } from '$indexcards/schemas';
	import showDateRange from '$lib/helpers/dt';
	import type { GridOptions, SchematColumn } from '$lib/layouts/grid/svgrid.js';
	import SVGrid from '$lib/layouts/grid/SVGrid.svelte';
    import type { IRow } from '@svar-ui/svelte-grid';
	import CalendarCell from './cells/circuitsCalendarCell.svelte';

	let { data }: { data: Tourn[] | null } = $props();

	let columns: SchematColumn[] = $derived.by(() => [
		{
			id: 'id',
			hidden: true,
		},
		{
			id: 'start',
			header: 'Date(s)',
			width: 50,
			template : (value  : string, row : IRow) => {
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
			width: 400,
		},
		{
			id: 'location',
			header: 'Location',
			width: 180,
			template: (value: string, row: IRow) => {
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
			width: 25,
			linkFunction: (row: IRow) => `/invite/${row.id}/results`,
			cell: CalendarCell,
		},
	]);

	let options: GridOptions = {
		title: 'Tournament Results',
		bigTitle: true,
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
