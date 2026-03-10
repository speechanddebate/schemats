<script lang="ts">
	let { row } = $props();

	// Todo: paradigm display
</script>

	<div class='flex flex-col justify-around w-full'>
		{#each row.judgeIds as judgeId (judgeId) }
			<div class='w-full ps-1 pe-0.5'>
				{ row.Judges[judgeId]?.code || '' }
				{ row.Judges[judgeId]?.first || '' }
				{ row.Judges[judgeId]?.last || '' }
			</div>
		{/each}
	</div>
