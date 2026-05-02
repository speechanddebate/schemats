<script lang="ts">
	let { row, column } = $props();

	const judges = $derived(row.Judges);

	const judgeIds = $derived.by( () => {
		return Object.keys(row.Judges).sort( (a, b) => {

			if (row.Results[a]?.chair && !row.Results[b]?.chair) return 1;
			if (row.Results[b]?.chair && !row.Results[a]?.chair) return -1;

			if (judges[a] && judges[b]) {
				return judges[a].name.localeCompare(judges[b].name);
			}

			if (a < b) return 1;
			if (a > b) return -1;
			return 0;
		});
	});

</script>

	{#if row.bye || row.forfeit }
		<div class="w-full py-1.25 { column.style} ">
			&nbsp;
		</div>
	{:else if column.key}
		{#each judgeIds as judgeId (judgeId) }
			{#if  row.Judges[judgeId][column.key]}
				<div class="w-full py-1.25 { column.style} ">
					{ row.Judges[judgeId].name }
				</div>
			{/if}
		{/each}
	{/if}
