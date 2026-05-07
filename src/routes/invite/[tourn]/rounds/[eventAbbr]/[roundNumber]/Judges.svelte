<script lang="ts">
	let { row } = $props();

	// Todo: paradigm display
</script>

	<div class='flex flex-col justify-around w-full'>
		{#if row.judgeIds.length > 0}
			{#each row.judgeIds as judgeId (judgeId) }
				<div class='w-full ps-1 pe-0.5'>
					{ row.Judges[judgeId]?.code || '' }
					{ row.Judges[judgeId]?.first || '' }
					{ row.Judges[judgeId]?.last || '' }
				</div>
			{/each}
		{:else if row.bye}
			<div class='w-full ps-1 pe-0.5 font-semibold italic'>
				BYE
			</div>
		{:else}
			<div class='w-full ps-1 pe-0.5 font-semibold italic'>
				{ row.judgeNames }
			</div>
		{/if}

	</div>
