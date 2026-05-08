<script lang="ts">
    import type { JudgeRecord } from '$indexcards/schemas';
    import { showDate } from '$lib/helpers/dt';
	import type { GridOptions, SchematColumn } from '$lib/layouts/grid/svgrid.js';
	import SVGrid from '$lib/layouts/grid/SVGrid.svelte';
	import type { IRow } from '@svar-ui/svelte-grid';

let { records }: { records: JudgeRecord[] } = $props();

let columns: SchematColumn[] = $derived.by( () => {
	return [
		{
			id: 'tournName',
			header: 'Tournament',
			width: 200,
		},
		{
			id: 'roundDate',
			header: 'Round Date',
			width: 160,
			template: (value: string) => {
				const date = new Date(value);
				return showDate({
					dt: date,
					format: 'full',
				});
			},
		},
		{
			id: 'roundLabel',
			header: 'Round',
			width: 80,
		},
		{
			id: 'eventAbbr',
			header: 'Event',
			width: 75,
		},
		{
			id: 'affLabel',
			header: 'Side',
			width: 75,
		},
		{
			id: 'affTeam',
			header: 'Team',
			width: 150,
		},
		{
			id: 'negLabel',
			header: 'Side',
			width: 75,
		},
		{
			id: 'negTeam',
			header: 'Team',
			width: 150,
		},
		{
			id: 'vote',
			header: 'Vote',
			width: 80,
		},
		{
			id: 'panelVote',
			header: 'Panel Vote',
			width: 100,
			template: (value: string, row: IRow) => {
				return `${value} ${row.record}`;
			},
		},
	];
});

let options: GridOptions = {
	title: 'Judge Record',
	tableOptions: {
	},
};

</script>

<SVGrid
	columns={columns}
	data={records}
	options={options}
/>
