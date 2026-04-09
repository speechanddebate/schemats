<script lang="ts">
    import type { JudgeRecord } from '$indexcards/schemas';
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
			width: 120,
		},
		{
			id: 'roundLabel',
			header: 'Round',
			width: 80,
		},
		{
			id: 'eventAbbr',
			header: 'Event',
			width: 80,
		},
		{
			id: 'affLabel',
			header: 'Aff Label',
			width: 80,
		},
		{
			id: 'affTeam',
			header: 'Aff Team',
			width: 200,
		},
		{
			id: 'negLabel',
			header: 'Neg Label',
			width: 80,
		},
		{
			id: 'negTeam',
			header: 'Neg Team',
			width: 200,
		},
		{
			id: 'vote',
			header: 'Judge Vote',
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
		reorder: true,
	},
};

</script>

<SVGrid
	columns={columns}
	data={records}
	options={options}
/>
