<script lang="ts">
    import type { RestParadigms200Item } from '$indexcards/schemas';

 let { item, onClick }: { item: RestParadigms200Item, onClick: (_id: number) => void } = $props();
</script>

<div
	class="
		group
		relative
		rounded-lg
		border border-slate-200
		bg-white
		shadow-sm
		transition-all
		duration-200
		hover:shadow-lg
		hover:border-slate-300
		overflow-hidden"
>
	<!-- Header with action button -->
	<div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 p-4 sm:p-5 pb-3 sm:pb-3">
		<div class="flex-1 min-w-0">
			<h3 class="text-base sm:text-lg md:text-xl font-semibold text-slate-900 truncate">
				{item.name}
			</h3>
		</div>
		<button
			class="
				shrink-0
				px-3
				py-1.5
				sm:px-4
				sm:py-2
				text-xs
				sm:text-sm
				font-medium
				rounded-md
				bg-primary-600
				text-white
				transition-colors
				hover:bg-primary-700
				active:bg-primary-800
				whitespace-nowrap
				cursor-pointer"
			onclick={() => onClick(item.id)}
			title="View paradigm"
			type="button"
		>
			View Paradigm
		</button>
	</div>

	<!-- Content area -->
	<div class="px-4 sm:px-5 pb-4 sm:pb-5 space-y-3">
		<!-- Tournament stats -->
		{#if item.tournJudged !== undefined && item.tournJudged !== null}
			<div class="flex items-center gap-2">
				<div class="flex-shrink-0 w-1 h-1 bg-slate-400 rounded-full"></div>
				<p class="text-xs sm:text-sm text-slate-600">
					Judged at <span class="font-semibold text-slate-900">{item.tournJudged}</span>
					tournament{item.tournJudged !== 1 ? 's' : ''}
				</p>
			</div>
		{/if}

		<!-- Schools -->
		{#if item.schools && item.schools.length > 0}
			<div class="space-y-2">
				<p class="text-xs sm:text-sm font-semibold text-slate-700">Has judged for:</p>
				<div class="flex flex-wrap gap-2">
					{#each item.schools as school, i (item.id + '-' + i)}
						<span class="
							inline-flex
							items-center
							rounded-full
							bg-gradient-to-r
							from-blue-50
							to-blue-100
							px-2.5
							sm:px-3
							py-1
							text-xs
							sm:text-sm
							font-medium
							text-blue-700
							border border-blue-200
							transition-colors
							group-hover:from-blue-100
							group-hover:to-blue-200
						">
							{school.name}
						</span>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>