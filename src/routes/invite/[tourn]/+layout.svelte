<script lang="ts">

	// Tournament Invitation layout shell.
	// WIP: Figuring out how to get a sidebar to work with uplift

	import { indexFetch } from '$lib/indexfetch';
	import { setContext } from 'svelte';
	
	import Loading from '$lib/layouts/Loading.svelte';
	import MainTitle from '$lib/layouts/MainTitle.svelte';

	import { ucfirst } from '$lib/helpers/text';
	import { showDateRange } from '$lib/helpers/dt';
    import TabLinks from '$lib/layouts/TabLinks.svelte';

    import type { Snippet } from 'svelte';
	import type { Webname } from './inviteTypes';
	import type { TabLink } from '$lib/layouts/TabLinks.svelte';

	// This pattern leads to reactive data display in Svelte 5 & TanStack,
	// which is otherwise tricky. It cost me dearly to discover this wisdom.

	let { data, children }: {data: Webname, children:Snippet} = $props();

	// Keep access to the URL path and Tourn ID throughout this segment.
	// I'm not sure this is the best way to do it, but it is a way.

	setContext('webname', data);

	let pageContent = indexFetch('/public/invite', {key: data.tournId});

	const tabs:TabLink[] = [];
	let sort = 1;

	for (const pageKey of ['main', 'events', 'register', 'follow', 'rounds', 'results']) {

		const route = `/invite/${data.webname}${pageKey === 'main' ? '' : `/${pageKey}` }`;
		const matchPatterns = [];

		if (pageKey === 'main') {
			matchPatterns.push(`/invite/${data.webname}/page/`);
		}

		tabs.push(
			{
				route,
				label : ucfirst(pageKey) || '',
				sort,
				matchPatterns,
			}
		);
		sort++;
	}

	let ranges = $derived(showDateRange({
		dtEndISO   : pageContent.data?.tourn?.end,
		dtStartISO : pageContent.data?.tourn?.start,
		format     : 'medday',
		mode       : 'date',
		showTz     : true,
		tz         : pageContent.data?.tourn.tz,
	}));

</script>

	{#if pageContent.status !== 'success' || pageContent.isFetching}
		<Loading tanstackJob={pageContent} />
	{:else}
		<div class="
			grow
			px-4
			ps-8
			bg-back-200
		">
			<!-- svelte-ignore attribute_quoted -->
			<MainTitle
				subtitle   = '{pageContent.data.tourn.location}'
				title      = '{pageContent.data.tourn.name}'
				undertitle = {ranges?.dateOutput}
			>
			</MainTitle>

			<div class='block invitePage'>
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
