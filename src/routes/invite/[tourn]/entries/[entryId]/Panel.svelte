<script lang="ts">

	import { resolve } from '$app/paths';
	import Gavel from '$lib/layouts/Gavel.svelte';
	let { row, column } = $props();

	const judges = $derived(row.Judges);

	const judgeIds = $derived.by( () => {
		return Object.keys(row.Judges).sort( (a, b) => {

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

	{#if row.bye || row.forfeit }
		<div class="w-full py-1.25 { column.elementClass } ">
			&nbsp;
		</div>
	{:else if column.key}
		{#each judgeIds as judgeId (judgeId) }
			{#if  row.Judges[judgeId][column.key]}
				<div class="w-full py-0.25 { column.style} flex ">
					{#if row.Judges[judgeId].chair}
						<span>
							<Gavel color='7fad70' />
						</span>
					{/if}
					{#if  row.Judges[judgeId].paradigm}
						<a
							class  = 'px-1 py-1 my-0 w-1/2 grow'
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
