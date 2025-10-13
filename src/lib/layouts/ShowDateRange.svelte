<script lang='ts'>

	import { showDateRange } from '$lib/helpers/dt';
	let input = $props();

	const { dateOutput, timeOutput } = showDateRange(input);

</script>

	{#if input.noSpan}
		<div class="{input.divClass}">
			{ dateOutput }
			{ timeOutput }
		</div>
	{:else }
		<div class="{input.divClass}">
			<span class="{input.dateClass || 'text-start pl-4'}">
				{ dateOutput }
			</span>
			<span class="{input.timeClass || 'text-end pr-4'}">
				{ timeOutput }
			</span>
		</div>
	{/if}