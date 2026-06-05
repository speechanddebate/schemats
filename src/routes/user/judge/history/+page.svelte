<script lang="ts">
    import QueryTable from '$lib/components/utils/QueryTable.svelte';
	import { createUserJudgesHistory } from '$indexcards';
	import type { JudgeHistory } from '$indexcards/schemas/judgeHistory';
	import { createAppColumnHelper } from '$lib/components/utils/table.hook';

	const historyQuery = createUserJudgesHistory();
	const columnHelper = createAppColumnHelper<JudgeHistory>();
		const columns = columnHelper.columns([
			columnHelper.accessor('Tourn.name', {
				id: 'name',
				header: 'Tournament',
			}),
			columnHelper.accessor('Tourn.start', {
				id: 'year',
				header: 'Year',
				cell: start => new Date(start.getValue()).getFullYear(),
				size: 60,
				maxSize: 60,
			}),
			columnHelper.display({
				id: 'dates',
				header: 'Dates',
				cell: ({ row }) => {
					const start = new Date(row.original.Tourn.start);
					const end = new Date(row.original.Tourn.end);
					return `${start.getMonth() + 1}/${start.getDate()} - ${end.getMonth() + 1}/${end.getDate()}`;
				},
			}),
			columnHelper.accessor('division', {
				id: 'division',
				header: 'Division',
			}),
			columnHelper.display({
				id: 'rounds',
				header: 'Rounds',
				cell: ({ row }) => {
					return `${row.original.roundsJudged}/${row.original.roundsObligated}`;
				},
				size: 80,
			}),
		]);
</script>
<h2>Judging History</h2>
<QueryTable
	{columns}
	query={historyQuery}
	/>