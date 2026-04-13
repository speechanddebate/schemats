<script lang="ts">
	import type { Tourn } from '$indexcards/schemas';
    import showDateRange from '$lib/helpers/dt';
	import type { GridOptions, SchematColumn } from '$lib/layouts/grid/svgrid.js';
	import SVGrid from '$lib/layouts/grid/SVGrid.svelte';
    import type { IRow } from '@svar-ui/svelte-grid';

	let { tournsData }: { tournsData: Tourn[] | null } = $props();

	let columns: SchematColumn[] = $derived.by(() => [
		{
			id: 'id',
			hidden: true,
		},
		{
			id: 'name',
			header: 'Name',
			width: 200,
		},
		{
			id: 'location',
			header: 'Location',
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
			id: 'start',
			header: 'Date(s)',
			template : (value  : string, row : IRow) => {
				return `${showDateRange({
					startDt: new Date(row.start),
					endDt: new Date(row.end),
					mode: 'date',
				}).dateOutput}`;
			},
		},
		{
			id: 'Events',
			header: 'Events',
			template : (value  : string, row : IRow) => {
				return row.Events?.map(event => event.abbr).join(', ');
			},
		},
		{
			id: 'registration',
			header: 'Registration',
			template : (value  : string, row : IRow) => {
				if(!row.regStart || !row.regEnd) return 'N/A';
				return `${showDateRange({
					startDt: new Date(row.regStart),
					endDt: new Date(row.regEnd),
					mode: 'date',
				}).dateOutput}`;
			},
		},
		{
			id: 'tz',
			header: 'Time Zone',
			template : (value  : string, row : IRow) => {
				return row.tz || '';
			},
		},
	]);

	let options: GridOptions = {
		noTitle: true,
		tableOptions: {
			reorder: true,
		},
	};

	</script>

	{#if tournsData && tournsData.length > 0}
	<div class='px-3 overflow-x-scroll py-3 bg-back wg-full'>
		<SVGrid
			columns={columns}
			data={tournsData}
			options={options}
		/>
	</div>
	{/if}
