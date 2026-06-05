<script lang="ts">

	let { column, row } = $props();

	type scoreData = {
		side  : string,
		tag   : string,
		scoreValues: {
			[key: string]: number | string,
		},
	};

	const scoreData = $derived.by( () => {

		const data:scoreData = {
			side        : '',
			tag         : '',
			scoreValues : {},
		};

		// be warned.  you will want to make side an int but because it's a key
		// it's a stringy int.
		[data.side, data.tag]  = column.id.split('-');

		Object.keys(row.Judges).forEach( (judgeId) => {
			const ballot = row.Entries[data.side]?.Ballots[judgeId];
			data.scoreValues[judgeId] = ballot?.[data.tag];
		});

		return data;
	});

</script>

	<div class='flex flex-col justify-around w-full ${column.columnClass} '>
		{#if Object.keys(row.Judges).length > 0}
			{#each Object.keys(row.Judges) as scoreJudgeId (scoreJudgeId) }
				<div class='w-full ps-1 pe-0.5 py-0.5'>
					{scoreData.scoreValues[scoreJudgeId]}
				</div>
			{/each}
		{/if}
	</div>