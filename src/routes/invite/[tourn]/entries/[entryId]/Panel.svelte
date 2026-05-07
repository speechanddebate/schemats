<script lang="ts">

	import { resolve } from '$app/paths';
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
				<div class="w-full py-0.25 { column.style} ">
					{#if  row.Judges[judgeId].paradigm}
						<a
							class  = 'px-1 py-1 my-0'
							href   = { resolve(`/paradigms/${row.Judges[judgeId].paradigm}`, {}) }
							target = '_blank'
							title  = 'Judge Paradigm'
						>{ row.Judges[judgeId].name }</a>
					{:else}
						<div
							class  = 'px-1 py-1 my-0'
						>{ row.Judges[judgeId].name }</div>
					{/if}
				</div>
			{/if}
		{/each}
	{/if}
