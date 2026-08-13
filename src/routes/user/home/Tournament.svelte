<script lang="ts">
    import TabItem from '$lib/layouts/TabItem.svelte';
    import Tabs from '$lib/layouts/Tabs.svelte';
	import { showDateRange } from '$lib/helpers/dt';
    import IconButton from '$lib/components/IconButton.svelte';
    import { FileText } from '@lucide/svelte';
	import {
		createUserTournsSummary,
		createUserTournsFines,
		createUserTournsBallots,
	} from '$indexcards';
	import { handleOrval } from '$lib/helpers/query';

	import type { Tourn } from '$indexcards/schemas';
    import Fine from './Fine.svelte';

	const { tourn }: { tourn: Tourn } = $props();

	const TournSummaryQuery = createUserTournsSummary(() => tourn.id,() => ({ query: { refetchInterval: 30*1000 } }));
	const tournSummary = $derived(handleOrval(TournSummaryQuery));

	const CurrBallotsQuery = createUserTournsBallots(() => tourn.id, () => ({}),
		() => ({ query: { refetchInterval: new Date(tourn.start) < new Date() ? 30*1000 : false } }));

	const FinesQuery = createUserTournsFines(() => tourn.id, () => ({ query: { refetchInterval: 30*1000 } }));
	const fines = $derived(handleOrval(FinesQuery));

const { dateOutput, timeOutput } = $derived(showDateRange({
	startISO: tourn.start,
	endISO: tourn.end,
	tz: tourn.tz,
	showTz: true,
}));

</script>
<div class="w-full border-2 rounded-md border-surface-500 shadow-md bg-surface-50 overflow-hidden">
	<div
		class="h-1 w-full bg-primary-500 animate-pulse"
		class:invisible={!TournSummaryQuery.isFetching && !CurrBallotsQuery.isFetching && !FinesQuery.isFetching}
	></div>
	<div class="p-2">
		<div class="flex flex-row flex-wrap">
		<div class="text-xl font-medium flex-grow-1">{tourn.name}</div>
		<a class="flex-grow-1 text-right hover:underline text-primary-600" href="/index/tourn/index.mhtml?tourn_id={tourn.id}">https://{tourn.webname}.tabroom.com</a>
		</div>
		<div>{dateOutput} {timeOutput}</div>
		<!-- TODO
		coach dashboard
		coach regisration
		spaces?
-->
		<div class="flex flex-row flex-wrap">
			<!-- TODO: display category, event and school info where relevant-->
		</div>
		<div class="flex flex-wrap">
			{#if (tournSummary?.livedoc)}
				<div class="relative shadow-sm border border-primary-700 rounded-lg px-2 py-2 m-2 basis-3xs grow">
					<div class="flex justify-center">
						<a class="font-semibold text-center" href={tournSummary?.livedoc.url}>
							{tournSummary?.livedoc.caption ?? 'Live Doc'}
						</a>
					</div>

					<div class="absolute right-2 top-1/2 -translate-y-1/2">
						<IconButton color="primary" label="Live Doc">
							<FileText size="20" />
						</IconButton>
					</div>
				</div>
			{/if}
			{#if (tournSummary?.roles.includes('coach'))}
				<div class="relative shadow-sm border border-primary-700 rounded-lg px-2 py-2 m-2 basis-3xs grow">
					<div class="flex justify-center">
							Coach Dashboard (not yet implemented)
					</div>
				</div>
				<div class="relative shadow-sm border border-primary-700 rounded-lg px-2 py-2 m-2 basis-3xs grow">
					<div class="flex justify-center">
							Registration (not yet implemented)
					</div>
				</div>
			{/if}
			{#if (tournSummary?.roles.includes('student'))}
				<div class="relative shadow-sm border border-primary-700 rounded-lg px-2 py-2 m-2 basis-3xs grow">
					<div class="flex justify-center">
							Student Dashboard (not yet implemented)
					</div>
				</div>
			{/if}
		</div>
	</div>
	{#snippet notImplemented()}
		<div class="rounded-md border border-yellow-200 bg-yellow-50 p-4">
			<h2 class="text-lg font-semibold text-yellow-900">Feature Under Development</h2>
			<p class="mt-2 text-sm text-yellow-800">
				This feature is still in progress. If you don't see what you need, please visit the
				<a
					class="font-semibold underline hover:text-yellow-900"
					href="https://www.tabroom.com/user/setup.mhtml"
					rel="noopener noreferrer"
					target="_blank"
				>
					legacy user home page
				</a>.
			</p>
		</div>
	{/snippet}

	{#if (!tournSummary && !TournSummaryQuery.isFetching)}
		<div class="text-center text-sm text-neutral-500">
			There was a problem loading this tournament's information. Please try again later.
		</div>
	{:else if (tournSummary)}
	<Tabs>
		<TabItem title="Info">{@render notImplemented()}</TabItem>
		<TabItem title="Schedule">{@render notImplemented()}</TabItem>
		{#if (tournSummary?.roles.includes('judge'))}
		<TabItem title="Current Ballots">{@render notImplemented()}</TabItem>
		<TabItem title="Past Ballots">{@render notImplemented()}</TabItem>
		{/if}
		{#if (tournSummary?.roles.includes('student'))}
			<TabItem title= 'Rounds'>{@render notImplemented()}</TabItem>
		{/if}
		{#if (fines && fines.length > 0)}
			<TabItem title="Fines">
				{#each fines as fine (fine.id)}
					<Fine {fine} />
				{/each}
			</TabItem>
		{/if}
	</Tabs>
	{/if}
</div>
