<script lang="ts">

	// Tournament Invitation Main Page.  Loads the basic tournament information
	// and creates the shell of the rest of the interface

	import Sidebar from '$lib/layouts/Sidebar.svelte';
	import Mainpage from '$lib/layouts/Mainpage.svelte';

	import { idxQuery } from '$lib/helpers/utils.svelte';
	import { fromStore } from 'svelte/store';

	import ShowDateRange from '$lib/layouts/ShowDateRange.svelte';
	import { ucfirst } from '$lib/helpers/text';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
    import TabLinks from '$lib/layouts/TabLinks.svelte';

	const data = {
		tournId : parseInt(page.params.tourn || '0'),
		webname : page.params.tourn,
	};

	// This pattern leads to reactive data display in Svelte 5 & TanStack,
	// which is otherwise tricky.

	let key = $state(data.tournId || data.webname);
	let queryStore = $derived(idxQuery({key, path: 'public/invite'}));
	let pageContent = $derived(fromStore(queryStore).current);

	import type { TabLink } from '$lib/layouts/TabLinks.svelte';
	const tabs:TabLink[] = []

	let sort = 1;

	for (const pageKey of ['main', 'events', 'register', 'follow', 'rounds', 'results']) {
		tabs.push(
			{
				route  : `/invite/${key}/${pageKey === 'main' ? '' : pageKey }`,
				label  : ucfirst(pageKey),
				active : (pageKey === 'main' ? true : false),
				sort,
			}
		);
		sort++;
	}

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

			<code>
				{JSON.stringify(page)}
			</code>
		</Mainpage>
		<Sidebar>
			<span class="sidenote">
				<h5 class='my-0 border-b-1 border-secondary-300 pb-0 leading-8 mb-2'>
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
								class = 'blue full bg-back-100 text-xs
									border-s-2 border-primary-800
									border-y-1 border-y-back-300
									hover:bg-secondary-100
									'
								href = {resolve(`/invite/${data.webname}/page/${webpage.title}`, {} )}
							>
								{ucfirst(webpage.title)}
							</a>
						{/if}
					{/each}
				{/if}
			</span>
		</Sidebar>
	{/if}
{/if}