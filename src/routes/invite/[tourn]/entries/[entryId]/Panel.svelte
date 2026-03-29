<script lang="ts">
	let { row, column } = $props();
</script>

	{#if column.key}
		{#each Object.keys(row.Results) as judgeId (judgeId) }
			{#if  row.Results[judgeId][column.key]}
				<div class="w-full py-1.25 { column.style} ">
					{ row.Results[judgeId][column.key] }
				</div>
			{/if}
		{/each}
	{/if}
