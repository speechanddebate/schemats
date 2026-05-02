<script lang='ts'>

	let { row, column } = $props();

	// Sort results by chair first, then judge last name thereafter
	const judges = $derived(row.Judges);

	const judgeIds = $derived.by( () => {
		return Object.keys(row.Results).sort( (a, b) => {
			if (row.Results[a].chair && !row.Results[b].chair) return 1;
			if (row.Results[b].chair && !row.Results[a].chair) return -1;

			if (judges[a] && judges[b]) {
				return judges[a].name.localeCompare(judges[b].name);
			}

			if (a < b) return 1;
			if (a > b) return -1;
			return 0;
		});
	});

	// Individual scores by name where needed
	const studentIds = $derived.by( () => {
		return Object.keys(row.Results.students).sort( (a, b) => {
			if (row.students[a] && row.students[b]) {
				return row.students[a].name.localeCompare(row.students[b].name);
			}
			if (a < b) return 1;
			if (a > b) return -1;
			return 0;
		});
	});

</script>
	{#if column.key}
		{#if column.key === 'winloss' && row.bye }
			<div class="w-full flex {column.style} py-1.25 font-semibold">
				BYE
			</div>
		{:else if column.key === 'winloss' && row.forfeit }
			<div class="w-full flex {column.style} py-1.25 font-semibold">
				Forfeit
			</div>
		{:else if row.Results}
			{#each judgeIds as judgeId (judgeId) }
				<div class="w-full flex {column.style} py-1.25">
					{#if row.students && row.students.length > 1 && row.Results[judgeId][column.key].students}
						{#each studentIds as studentId (studentId) }
							<span class="grow px-0.5">
								<span class="w-2/3">
									{ row.students[studentId].label }
								</span>
								<span class="w-1/3">
									{ row.Results[judgeId].students[studentId][column.key] }
								</span>
							</span>
						{/each}
					{:else}
						<span class="grow px-0.5">
							{ row.Results[judgeId][column.key] }
						</span>
					{/if}
				</div>
			{/each}
		{/if}
	{/if}
