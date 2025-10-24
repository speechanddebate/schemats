<script lang="ts">

	// Tournament Invitation layout shell.
	// WIP: Figuring out how to get a sidebar to work with uplift

	import { indexFetch } from '$lib/indexfetch';
	import { setContext } from 'svelte';
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';

	import MainTitle from '$lib/layouts/MainTitle.svelte';

	import { ucfirst } from '$lib/helpers/text';
	import { showDateRange } from '$lib/helpers/dt';
    import TabLinks from '$lib/layouts/TabLinks.svelte';

	import type { TabLink } from '$lib/layouts/TabLinks.svelte';

	const data = {
		tournId : parseInt(page.params.tourn || '0'),
		webname : page.params.tourn,
	};

	// This pattern leads to reactive data display in Svelte 5 & TanStack,
	// which is otherwise tricky. It cost me dearly to discover this wisdom.

	let key = $state(data.tournId || data.webname);
	let pageContent = indexFetch('/public/invite', {key});

	setContext('inviteKey', key);
	setContext('inviteTournId', pageContent.data.tourn.id);

	let { children }: { children: Snippet } = $props();

	const tabs:TabLink[] = [];
	let sort = 1;

	for (const pageKey of ['main', 'events', 'register', 'follow', 'rounds', 'results']) {
		const route = `/invite/${key}${pageKey === 'main' ? '' : `/${pageKey}` }`;
		tabs.push(
			{
				route,
				label : ucfirst(pageKey) || '',
				sort,
			}
		);
		sort++;
	}

	let ranges = $derived(showDateRange({
		dtEndISO   : pageContent.data?.tourn.end,
		dtStartISO : pageContent.data?.tourn.start,
		format     : 'medium',
		mode       : 'date',
		showTz     : true,
		tz         : pageContent.data?.tourn.tz,
	}));

</script>

{#if pageContent.isLoading || pageContent.isPending}
	<span class="py-8 text-2xl">Loading data...</span>
{:else if pageContent.isError}
	<span>Error: {pageContent.error.message}</span>
{:else}
	{#if pageContent.isFetching}
		<div class='font-semibold text-warning-600'>
			Data Updating...
		</div>
	{:else if pageContent.isFetched }

		<div class="
			block
			px-4
			ps-8
			bg-back-200
		">
			<MainTitle
				subtitle = {`${pageContent.data.tourn.city},
							 ${pageContent.data.tourn.state || pageContent.data.tourn.country }`}
				title      = {pageContent.data.tourn.name}
				undertitle = {ranges.dateOutput}
			>
			</MainTitle>

			<div class='block'>
				<TabLinks tabs={tabs} />
				<div
					class="flex w-full
					border-t-2 border-secondary-400
				">
					{@render children() }
				</div>
			</div>
		</div>
	{/if}
{/if}
