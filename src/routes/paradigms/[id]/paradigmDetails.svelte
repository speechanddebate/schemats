<script lang="ts">
	import { TabItem, Tabs, Skeleton } from 'flowbite-svelte';
	import { showDateTime } from '$lib/helpers/dt';
	import ParadigmCertification from './paradigmCertification.svelte';
	import type { ParadigmDetails } from '$indexcards/schemas';
	import { getPerson } from '$lib/helpers/SessionContext.svelte';
    import type { JudgeRecord } from '$indexcards/schemas';
	import JudgeRecordTable from './judgeRecord.svelte';

	type Props = {
		data         : ParadigmDetails | null;
		record       : JudgeRecord[] | null;
		isLoading    : boolean;
		recordLoading : boolean;
		displayBack  : boolean;
		backFunction : () => void;
	};

	const { data: paradigmDetails, record, isLoading, recordLoading, displayBack, backFunction }: Props = $props();

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
	<h2
		class="mb-4 flex flex-col gap-2 text-2xl font-bold
			sm:mb-6 sm:flex-row sm:items-center sm:justify-between sm:text-3xl"
	>
		<span>{paradigmDetails?.name ?? (isLoading ? 'Loading...' : 'No data')}</span>
		{#if paradigmDetails?.lastReviewed}
			<span class="text-sm font-normal text-primary-600 sm:ml-4 sm:text-base sm:whitespace-nowrap">
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
			<TabItem title="Record">
			{#if recordLoading}
				<Skeleton size="lg"/>
			{:else if record && record.length > 0}
				<JudgeRecordTable records={record} />
			{:else}
				<p class="text-primary-600">No record information available</p>
			{/if}
			</TabItem>
		{#if paradigmDetails?.certifications && paradigmDetails.certifications.length > 0}
			<TabItem title="Certifications">
				<div class="space-y-4">
					{#each paradigmDetails.certifications as cert, index (`${cert.title}-${cert.updatedAt}-${cert.badge?.imageUrl ?? index}`)}
						<ParadigmCertification {cert} />
					{/each}
				</div>
			</TabItem>
		{/if}
	</Tabs>
</div>