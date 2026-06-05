<script lang="ts">
	let { row } = $props();
</script>
	<div class='flex flex-col justify-around w-full'>
		{#if Object.keys(row.Judges).length > 0}
			{#each Object.keys(row.Judges) as judgeId (judgeId) }
				<div class='w-full ps-1 pe-0.5 py-0.5'>
					{ row.Judges[judgeId]?.code || '' }
					{ row.Judges[judgeId]?.first || '' }
					{ row.Judges[judgeId]?.last || '' }
				</div>
			{/each}
		{:else if row.bye}
			<div class='w-full ps-2 pe-0.5 py-0.5 font-semibold'>
				BYE
			</div>
		{/if}
	</div>