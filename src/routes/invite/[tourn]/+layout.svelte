<script lang="ts">

	// Tournament Invitation layout shell.

	// WIP: Figuring out how to get a sidebar to work with uplift

	import { fromStore } from 'svelte/store';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { setContext } from 'svelte';

	import Sidebar from '$lib/layouts/Sidebar.svelte';
	import Mainpage from '$lib/layouts/Mainpage.svelte';
	import { idxQuery } from '$lib/helpers/utils.svelte';
	import ShowDateRange from '$lib/layouts/ShowDateRange.svelte';
	import { ucfirst } from '$lib/helpers/text';
    import TabLinks from '$lib/layouts/TabLinks.svelte';

	import type { Snippet } from 'svelte';
	import type { TabLink } from '$lib/layouts/TabLinks.svelte';

	type Round = {
		roundId            : number,
		roundName          : number,
		roundLabel         : string,
		roundType          : string,
		published          : number,
		roundPostPrimary   : number,
		roundPostSecondary : number,
		roundPostFeedback  : number,
		eventId            : number,
		eventName          : string,
		eventAbbr          : string,
		eventType          : string,
	};

	const data = {
		tournId : parseInt(page.params.tourn || '0'),
		webname : page.params.tourn,
	};

	// This pattern leads to reactive data display in Svelte 5 & TanStack,
	// which is otherwise tricky. It cost me dearly to discover this wisdom.

	let key = $state(data.tournId || data.webname);
	let queryStore = $derived(idxQuery({key, path: 'public/invite'}));
	let pageContent = $derived(fromStore(queryStore).current);

	setContext('inviteKey', key);
	let { children }: { children: Snippet } = $props();

	const tabs:TabLink[] = [];
	let sort = 1;

	for (const pageKey of ['main', 'events', 'register', 'follow', 'rounds', 'results']) {
		const route = `/invite/${key}${pageKey === 'main' ? '' : `/${pageKey}` }`;
		tabs.push(
			{
				route,
				label  : ucfirst(pageKey),
				sort,
			}
		);
		sort++;
	}

	const tournId = $derived(pageContent.data?.tourn?.id);
	let queryRounds = $derived(idxQuery({key: `${tournId}/rounds`, path: `public/invite`}));
	let roundList = $derived(fromStore(queryRounds).current);
	const usedEvent: { [n: number]: boolean } = {};

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
	{:else if pageContent.data.tourn }

		<Mainpage title={pageContent.data.tourn.name}>
			<TabLinks tabs={tabs} />
			<div class='w-full
				bg-back dark:bg-back-800 min-h-dvh
				py-6 px-8
				border-t-2 border-secondary-400  rounded'
			>
				{@render children() }
			</div>
		</Mainpage>

		<Sidebar>
			{#if (
				page.route.id === '/invite/[tourn]/rounds'
				|| page.route.id?.includes('/invite/[tourn]/round'
				)
			)}
				<span class="sidenote">
					<h5 class='my-0 border-b-1 border-secondary-500 pb-0 leading-8 mb-2'>
						Published Rounds
					</h5>

					<div class='flex flex-wrap'>
						{#each roundList.data as round (round.roundId)}
							{#if (!usedEvent[round.eventId]) }
								<div
									class = 'blue full bg-back-100 text-sm
										border-s-2 border-primary-400
										border-y-1 border-y-back-300
										hover:bg-secondary-100
										w-1/3
										p-1 mb-1
									'
								>{round.eventAbbr}</div>
								{ usedEvent[round.eventId] = true, ''}
							{/if}

							<a
								class = 'blue full bg-back-100 text-xs
									border-s-2 border-primary-400
									border-y-1 border-y-back-300
									hover:bg-secondary-100
									hidden
								'
								href = {resolve(`/invite/${data.webname}/round/${round.id}`, {} )}
							>{round.eventAbbr} { round.label || `Round ${round.roundName}`}</a>
						{/each}
					</div>
				</span>

			{:else}
				<span class="sidenote">
					<h5 class='my-0 border-b-1 border-secondary-500 pb-0 leading-8 mb-2'>
						Location
					</h5>
					<p class='text-sm mb-0 pb-1'>
						{ pageContent.data.tourn.city },
						{ pageContent.data.tourn.state || pageContent.data.tourn.country }
					</p>

					<h5 class='my-0 border-b-1 border-secondary-500 pb-0 leading-8 mb-2'>
						Dates
					</h5>
					<ShowDateRange
						dateClass  = 'text-sm block pb-1'
						divClass   = 'w-full ps-1'
						dtEndISO   = { pageContent.data.tourn.end }
						dtStartISO = { pageContent.data.tourn.start }
						format     = 'medday'
						mode       = 'date'
						showTz     = { true }
						timeClass  = 'italic text-xs block'
						tz         = { pageContent.data.tourn.tz }
					/>

					<h5 class='my-0'>
						Contacts
					</h5>

					{#each pageContent.data.contacts as contact (contact.email)}
						<a
							class = 'blue full bg-back-100 text-xs
								border-s-2 border-primary-400
								border-y-1 border-y-back-300
								hover:bg-secondary-100
							'
							href = 'mailto:{ contact.email }'
						>
							{contact.first}
							{contact.middle}
							{contact.last}
						</a>
					{/each}

					{#if (pageContent.data.pages.length > 1)}
						<h4>Additional Information</h4>
						{#each pageContent.data.pages as webpage (webpage.id)}
							{#if webpage.special !== 'main'}
								<a
									class = '
										{ page.url.pathname === `/invite/${data.webname}/web/${webpage.id}`
											? 'bg-primary-700 text-secondary-200 hover:text-black hover:bg-secondary-300'
											: 'bg-back-100 text-black'
										}
										blue full bg-back-100 text-xs
										border-s-2 border-primary-800
										border-y-1 border-y-back-300
										hover:bg-secondary-100
										'
									href = {resolve(`/invite/${data.webname}/web/${webpage.id}`, {} )}
								>
									{ucfirst(webpage.title)}
								</a>
							{/if}
						{/each}
					{/if}
				</span>
			{/if}
		</Sidebar>
	{/if}
{/if}
