<script lang="ts">
	import { createGetParadigmByPersonId } from '$indexcards';
import { TabItem, Tabs } from 'flowbite-svelte';
import { userTimeZone, userLocale } from '$lib/stores/userTimeZone';
import { longDateTimeFormat } from '$lib/helpers/dateTime';
type Props = {
    personId: number;
	displayBack: boolean;
	backFunction: () => void;
  };

const { personId, displayBack, backFunction } = $props()

const paradigmDetailsQuery = createGetParadigmByPersonId(
		() => personId || 0,
		() => ({
			query: {
				enabled: personId !== null,
			},
		}),
	);

		const paradigmDetails = $derived.by(() => {
		if (!paradigmDetailsQuery.data) return null;
		if (paradigmDetailsQuery.data.status === 200) {
			return paradigmDetailsQuery.data.data || null;
		}
		return null;
	});
</script>

<div class="rounded-lg border border-secondary-200 bg-white p-6">
	{#if displayBack}
		<button
			class="mb-4 text-sm text-secondary-600 hover:text-secondary-900 font-semibold"
			onclick={backFunction}
			type="button"
		>
			← Back to results
		</button>
	{/if}
	<h2 class="text-3xl font-bold text-secondary-900 mb-6 flex items-center justify-between">
		<span>{paradigmDetails?.name || 'Paradigm'}</span>
		{#if paradigmDetails?.lastReviewed}
			<span class="text-base font-normal text-secondary-500 ml-4 whitespace-nowrap">
				Last reviewed: {longDateTimeFormat(new Date(paradigmDetails.lastReviewed), $userTimeZone, $userLocale)}
			</span>
		{/if}
	</h2>

	<Tabs>
		<TabItem title="Paradigm">
			<div class="text-secondary-700">
				{#if paradigmDetailsQuery.isLoading}
					<p class="text-secondary-600">Loading paradigm details...</p>
				{:else if paradigmDetails}
					{#if paradigmDetails.paradigm}
						<div class="prose prose-sm max-w-none">
							{@html paradigmDetails.paradigm}
						</div>
					{:else}
						<p class="text-secondary-600">No paradigm text available</p>
					{/if}
				{:else}
					<p class="text-secondary-600">No paradigm information available</p>
				{/if}
			</div>
		</TabItem>
		{#if paradigmDetails?.record && paradigmDetails.record.length > 0}
			<TabItem title="Record">
				<div class="text-secondary-700">
					<pre class="text-secondary-600">{JSON.stringify(paradigmDetails.record, null, 2)}</pre>
				</div>
			</TabItem>
		{/if}
		{#if paradigmDetails?.certifications && paradigmDetails.certifications.length > 0}
			<TabItem title="Certifications">
				<div class="text-secondary-700">
					<pre class="text-secondary-600">{JSON.stringify(paradigmDetails.certifications, null, 2)}</pre>
				</div>
			</TabItem>
		{/if}
	</Tabs>
</div>