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

</script>

	{#if !row.bye && !row.forfeit && row.Results }
		{#each judgeIds as judgeId (judgeId) }
			<div class ="{column.elementClass || column.style } { defaultClass }">
				{#if row.Results[judgeId].Students[column.key] }
					{#each Object.keys(row.Results[judgeId].Students[column.key]) as scoreTag (scoreTag) }
						<span class="grow px-0.5 w-1/3">
							{ row.Results[judgeId].Students[column.key][scoreTag] }
						</span>
					{/each}
				{/if}
			</div>
		{/each}
	{/if}
