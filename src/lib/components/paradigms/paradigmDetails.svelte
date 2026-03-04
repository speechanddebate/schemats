<script lang="ts">
	import { TabItem, Tabs, Skeleton } from 'flowbite-svelte';
	import { showDateTime } from '$lib/helpers/dt';
	import ParadigmCertification from './paradigmCertification.svelte';
	import type { ParadigmDetails } from '$indexcards/schemas';
	import { getPersonContext } from '$lib/context/PersonContext.svelte';

	type Props = {
		data: ParadigmDetails | null;
		isLoading: boolean;
		displayBack: boolean;
		backFunction: () => void;
	};

	const { data: paradigmDetails, isLoading, displayBack, backFunction }: Props = $props();

	const person = $derived(getPersonContext());

</script>

<div class="rounded-lg border border-primary-200 bg-white p-6">
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
		<span>{paradigmDetails?.name}</span>
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

	<Tabs class="text-primary-700">
		<TabItem open title="Paradigm">
			<div class="text-primary-700">
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
		{#if paradigmDetails?.record && paradigmDetails.record.length > 0}
			<TabItem title="Record">
				<div class="text-primary-700">
					<pre class="text-primary-600">{JSON.stringify(paradigmDetails.record, null, 2)}</pre>
				</div>
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