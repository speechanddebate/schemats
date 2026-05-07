<script lang="ts">
	import { TabItem, Tabs, Skeleton } from 'flowbite-svelte';
	import { showDateTime } from '$lib/helpers/dt';
	import ParadigmCertification from './paradigmCertification.svelte';
	import type { ParadigmDetails } from '$indexcards/schemas';
	import { getPerson } from '$lib/helpers/SessionContext.svelte';
    import type { JudgeRecord } from '$indexcards/schemas';
	import JudgeRecordTable from '../../../lib/components/judgeRecord.svelte';

	type Props = {
		data         : ParadigmDetails | null;
		record       : JudgeRecord[] | null;
		isLoading    : boolean;
		displayBack  : boolean;
		backFunction : () => void;
	};

	const { data: paradigmDetails, record, isLoading, displayBack, backFunction }: Props = $props();

	const person = $derived(getPerson());

</script>

<div class="rounded-lg border border-secondary-400 bg-white p-6 text-slate-700">
	{#if displayBack}
		<button
			class="mb-4 text-primary-600 hover:text-primary-900 text-sm font-semibold"
			onclick={backFunction}
			type="button"
		>
			← Back to results
		</button>
	{/if}
	<h2 class="text-3xl font-bold mb-6 flex items-center justify-between">
		<span>{paradigmDetails?.name ?? (isLoading ? 'Loading...' : 'No data')}</span>
		{#if paradigmDetails?.lastReviewed}
			<span class="text-base font-normal text-primary-600 ml-4 whitespace-nowrap">
				Last reviewed: {showDateTime({
					dt: new Date(paradigmDetails.lastReviewed),
					tz: person?.tz || 'UTC',
					showTz   : true,
					joinWord : 'at',
				})}
			</span>
		{/if}
	</h2>

	<Tabs>
		<TabItem open title="Paradigm">
			<div>
				{#if isLoading}
					<Skeleton size="lg"/>
				{:else if paradigmDetails}
					{#if paradigmDetails.paradigm}
						<div class="prose prose-sm max-w-none">
							{@html paradigmDetails.paradigm}
						</div>
					{:else}
						<p class="text-primary-600">No paradigm text available</p>
					{/if}
				{:else}
					<p class="text-primary-600">No paradigm information available</p>
				{/if}
			</div>
		</TabItem>
		{#if record && record.length > 0}
			<TabItem title="Record">
			<JudgeRecordTable records={record} />
			</TabItem>
		{/if}
		{#if paradigmDetails?.certifications && paradigmDetails.certifications.length > 0}
			<TabItem title="Certifications">
				<div class="space-y-4">
					{#each paradigmDetails.certifications as cert (cert.title)}
						<ParadigmCertification {cert} />
					{/each}
				</div>
			</TabItem>
		{/if}
	</Tabs>
</div>