<script lang="ts">
	import { resolve } from '$app/paths';

	let { row } = $props();
</script>

	<div class='flex flex-col justify-around w-full'>
		{#if Object.keys(row.Judges).length > 0}
			{#each Object.keys(row.Judges) as judgeId (judgeId) }
				<div class='w-full ps-1 pe-0.5'>
					{#if  row.Judges[judgeId].paradigm}
						<a
							class  = 'p-0 m-0 w-full font-normal text-black'
							href   = { resolve(`/paradigms/${row.Judges[judgeId].paradigm}`, {}) }
							target = '_blank'
							title  = 'Judge Paradigm'
						>
							{ row.Judges[judgeId]?.code || '' }
							{ row.Judges[judgeId]?.first || '' }
							{ row.Judges[judgeId]?.last || '' }
						</a>
					{:else}
						{ row.Judges[judgeId]?.code || '' }
						{ row.Judges[judgeId]?.first || '' }
						{ row.Judges[judgeId]?.last || '' }
					{/if}
				</div>
			{/each}
		{:else if row.bye}
			<div class='w-full ps-1 pe-0.5 font-semibold italic'>
				BYE
			</div>
		{/if}
	</div>
