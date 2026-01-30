<script lang='ts'>

	// A component to show date ranges in various formatting.  I hopefully will
	// never have the Date() module show up anywhere but here and the helpers,
	// so when Temporal is ready for prime time I can just rip it through this.

	import { showDateRange } from '$lib/helpers/dt';
	import type {FormattedRanges} from '$lib/helpers/dt';

	let input = $props();

	let {fullOutput, dateOutput, timeOutput, error}:FormattedRanges = $derived.by( () => {
		return showDateRange(input);
	});

</script>

	{#if error}
		<span class="{input.spanClass}">
			{ error }
		</span>
	{/if}

	{#if input.noSpan}
		<span class="{input.spanClass}">
			{ fullOutput }
			{ dateOutput }
			{ timeOutput }
		</span>
	{:else }
		<span class="{input.spanClass}">
			{#if fullOutput}
				{ fullOutput }
			{:else}
				{#if dateOutput}
					<span class="{input.dateClass || 'text-start pl-4'}">
						{ dateOutput }
					</span>
				{/if}
				{#if timeOutput}
					<span class="{input.timeClass || 'text-end pr-4'}">
						{ timeOutput }
					</span>
				{/if}
			{/if}
		</span>
	{/if}