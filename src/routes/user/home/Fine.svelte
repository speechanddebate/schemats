<script lang="ts">
    import { showDateTime } from '$lib/helpers/dt';
    import { getPerson } from '$lib/helpers/SessionContext.svelte';
import type { PersonTournSummaryFinesItem } from '$indexcards/schemas';
let { fine }:{fine: PersonTournSummaryFinesItem } = $props();

const person = getPerson();

</script>

<div class="pt-1 ">
	<div class="w-full mb-4 p-0 bg-surface-400 border border-x-surface-700 border-b-surface-600 border-t-primary-600">
		<div class="w-full box-border pt-1 bg-surface-500 border-x border-x-surface-700">
			<span class="inline-block w-[8.5%] px-[0.45%] py-[3px] my-[2px] font-semibold pl-2">
				Amount:
			</span>
			<span class="w-tenth">
				{fine.currency ? fine.currency : '$'}{fine.amount}
			</span>

			<span class="font-semibold w-eighth">
				Assessed At:
			</span>
			<span class="w-quarter">
				{showDateTime({
					dtISO: fine.leviedAt,
					tz: person?.tz ?? undefined,
				} )}
			</span>
			<span class="w-tenth font-semibold">
				Billed To:
			</span>

			<span class="w-threetenths">
				{fine.schoolName}
			</span>
		</div>

		<div class="w-full px-2">
			<span class="w-tenth font-semibold pl-2">
				Reason:
			</span>
			<span class="w-ninetenths">
				{`${fine.reason?.replace(/JUDGE FINE:/g, '')} did not judge.`}
			</span>
		</div>
	</div>
</div>
