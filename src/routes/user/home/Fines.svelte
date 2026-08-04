<script lang="ts">
    import { showDateTime } from '$lib/helpers/dt';
    import { getPerson } from '$lib/helpers/SessionContext.svelte';

type Fine = {
	id: number,
	currency: string,
	amount: number,
	reason: string,
	school: string,
	levied: Date,

};
let { fines }:{fines: Fine[] } = $props();

const person = getPerson();

</script>
{#if (fines && fines.length > 0)}
	<div class="pt-1 darkscreen">
		<h5>Your Judging Fines</h5>
		{#each fines as fine (fine.id)}
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
							dtISO: fine.levied.toISOString(),
							tz: person?.tz ?? undefined,
						} )}
					</span>
					<span class="w-tenth font-semibold">
						Billed To:
					</span>

					<span class="w-threetenths">
						{fine.school}
					</span>
				</div>

				<div class="w-full px-2">
					<span class="w-tenth font-semibold pl-2">
						Reason:
					</span>
					<span class="w-ninetenths">
						{`${fine.reason.replace(/JUDGE FINE:/g, '')} did not judge.`}
					</span>
				</div>
			</div>
		{/each}
	</div>
{/if}
