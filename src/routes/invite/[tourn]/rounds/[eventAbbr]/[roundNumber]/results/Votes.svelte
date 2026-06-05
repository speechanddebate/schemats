<script lang="ts">

	let { column, row } = $props();

	type scoreData = {
		byes  : string[],
		[key  : string]: number | string | string[] | undefined,
		// Typescript should be ashamed that that's what I had to do there.
	};

	const scoreData:scoreData = $derived.by( () => {

		const data:scoreData = {
			byes: [],
		};

		Object.keys(row.Entries).forEach( (side) => {
			Object.keys(row.Judges).forEach( (judgeId) => {
				if (row.Entries[side]?.Ballots.bye) {
					data.byes.push(`${row.Entries[side].side } Bye`);
				} else if (row.Entries[side]?.Ballots.forfeit) {
					data.byes.push(`${row.Entries[side].side } Fft`);
				} else {

					const result = row.Entries[side]?.Ballots[judgeId]?.[column.id];
					if (result === 'W' || result == 1 || result == '1') {
						data[judgeId] = row.Entries[side]?.side.toUpperCase();
					}
				}
			});
		});

		return data;
	});

</script>

	<div class='flex flex-col justify-around w-full ${column.columnClass} '>
		{#if row.bye}
			''
		{:else if scoreData.byes.length > 0 }
			{#each scoreData.byes as byeText (byeText)}
				<div class='w-full ps-1 pe-0.5 py-0.5 text-[0.6rem] leading-1 text-center'>
					{byeText}
				</div>
			{/each}
		{:else if Object.keys(row.Judges).length > 0}
			{#each Object.keys(row.Judges) as scoreJudgeId (scoreJudgeId) }
				<div class='w-full ps-1 pe-0.5 py-0.5'>
					{scoreData[scoreJudgeId]}
				</div>
			{/each}
		{/if}
	</div>