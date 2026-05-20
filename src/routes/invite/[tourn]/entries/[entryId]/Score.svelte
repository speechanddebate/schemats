<script lang='ts'>

	let { row, column } = $props();

	// Set a reasonable default for the formatting for the elements in the cell
	const defaultClass = 'w-full text-center py-1.25';

	// Sort results by chair first, then judge last name thereafter
	let judges = $derived(row.Judges);

	let judgeIds = $derived.by( () => {
		return Object.keys(row.Results).sort( (a, b) => {
			if (row.Judges[a]?.chair !== row.Judges[b]?.chair) {
				return row.Judges[b]?.chair - row.Judges[a]?.chair;
			}

			if (judges[a] && judges[b]) {
				return judges[a].name.localeCompare(judges[b].name);
			}

			if (a < b) return 1;
			if (a > b) return -1;
			return 0;
		});
	});

	// Individual scores by name where needed
	let studentIds = $derived.by( () => {
		return Object.keys(row.Results.students).sort( (a, b) => {
			if (row.students[a] && row.students[b]) {
				return row.students[a].name.localeCompare(row.students[b].name);
			}
			if (a < b) return 1;
			if (a > b) return -1;
			return 0;
		});
	});

	let presidingOfficer = $derived.by( () => {
		let po:boolean = false;
		judgeIds.forEach( (judge) => {
			if (row.Results[judge].po) po = true;
		});
		return po;
	});

</script>

	{#if column.key}
		{#if column.key === 'winloss' && row.coachedover }
			<div
				class = "{column.elementClass || column.style } { defaultClass }"
				title = "Entry was coached over; opponent from the same team advanced without debating"
			>
				C/O
			</div>
		{:else if column.key === 'winloss' && row.bye }
			<div class ="{column.elementClass || column.style } { defaultClass }">
				BYE
			</div>
		{:else if column.key === 'winloss' && row.forfeit }
			<div class ="{column.elementClass || column.style } { defaultClass }">
				Forfeit
			</div>
		{:else if column.key === 'po'}
			{#if presidingOfficer}
				<div class ="{column.elementClass || column.style } { defaultClass }"
					title ="Presiding Officer"
				>
					PO
				</div>
			{/if}
		{:else if column.key === 'speech'}
			{#each judgeIds as judgeId (judgeId) }
				<div class ="{column.elementClass || column.style } { defaultClass } h-[22px]"
					title ="Scores Given by { judgeId }"
				>{ row.Results[judgeId].speechPoints || '' }</div>
			{/each}
		{:else if row.Results}
			{#each judgeIds as judgeId (judgeId) }
				<div class ="{column.elementClass || column.style } { defaultClass }">
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
