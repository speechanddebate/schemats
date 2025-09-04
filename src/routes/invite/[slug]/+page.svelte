<script lang="ts">
	// Tournament Invitation Main Page.
	import Tabs from '$lib/layouts/Tabs.svelte';
	import TabItem from '$lib/layouts/TabItem.svelte';
	import { fromStore } from 'svelte/store';
	import { idxQuery } from '$lib/helpers/utils.svelte';
	import ShowDateRange from '$lib/layouts/ShowDateRange.svelte';
	import { ucfirst } from '$lib/helpers/text';

	interface InviteParams {
		tournId: number | undefined,
		webname: string | undefined,
	}

	// This pattern leads to reactive data display in Svelte 5 & TanStack,
	// which is otherwise tricky.

	let { data }: {data:InviteParams } = $props();
	let key = $state(data.tournId || data.webname);

	let queryStore = $derived(idxQuery({key, path: 'public/invite'}));
	let pageContent = $derived(fromStore(queryStore).current);

</script>

<div class="pb-8">

	{#if pageContent.isLoading || pageContent.isPending}
		<span class="py-8 text-2xl">Loading data...</span>
	{:else if pageContent.isError}
		<span>Error: {pageContent.error.message}</span>
	{:else}
		{#if pageContent.isFetching}
			<div style="color:darkgreen; font-weight:700">Data Updating...</div>
		{:else if pageContent.data.tourn }
			<div
				class = 'flex min-h-[80vh] override'
			>
				<span
					class='
						grow
						content-start
						w-[75%] resize-x
						bg-back-200
						rounded-tl-lg'
				>
					<div class = '
						pt-4 pl-8 pr-2
						w-full'
					>
						<h3 class='text-left font-semibold'>
							{ pageContent.data.tourn.name }
						</h3>

					</div>
					<div class='pl-8 pr-4 mt-2'>
					<Tabs
						contentClass = 'mt-0 border-t-2 border-secondary-500 rounded'
					>
						{#each pageContent.data.pages as page (page.id)}
							{#if page.special}
								<TabItem
									open  = { page.title === 'main' ? true : false }
									title = { ucfirst(page.title) || ucfirst(page.special)}
								>
									<div
										class = "ps-4 pe-2 min-h-[70vh]"
									>
										<h5 class='
											border-b-1 border-primary-600
											mb-4
										'>{ucfirst(page.title) || ucfirst(page.special)}</h5>
										{@html page.content}
									</div>
								</TabItem>
							{/if}
						{/each}

						<TabItem
							title = "Events"
						>
							<div
								class = "bg-back pb-8 ps-4 pe-2 min-h-[70vh]"
							>
								<h5 class='
									border-b-1 border-primary-600
									mb-4
								'>Events and Divisions</h5>
								{#each pageContent.data.events as event (event.id) }
									<h6>{event.name}</h6>
									<p>{event.abbr}</p>
									<p>${event.fee}</p>
									<p>{@html event.description}</p>
								{/each}
							</div>
						</TabItem>

						<TabItem
							title = "Register"
						>
							<div
								class = "bg-back pb-8 ps-4 pe-2 min-h-[70vh]"
							>
								<h5 class='
									border-b-1 border-primary-600
									mb-4
								'>Register</h5>
							</div>
						</TabItem>

						<TabItem
							title = "Follow"
						>
							<div
								class = "bg-back pb-8 ps-4 pe-2 min-h-[70vh]"
							>
								<h5 class='
									border-b-1 border-primary-600
									mb-4
								'>Follow Entries or Judges</h5>
								{#each pageContent.data.events as event (event.id) }
									<h6>{event.name}</h6>
								{/each}
							</div>
						</TabItem>

						<TabItem
							title = "Rounds"
						>
							<div
								class = "bg-back pb-8 ps-4 pe-2 min-h-[70vh]"
							>
								<h5 class='
									border-b-1 border-primary-600
									mb-4
								'>Schematics</h5>
							</div>
						</TabItem>

						<TabItem
							title = "Results"
						>
							<div
								class = "bg-back pb-8 ps-4 pe-2 min-h-[70vh]"
							>
								<h5 class='
									border-b-1 border-primary-600
									mb-4
								'>Results</h5>
							</div>
						</TabItem>
					</Tabs>
					</div>

				</span>
				<span class="
					menu
					resize-x
					w-[25%]
					p-2
					px-4
					content-start
					border-l border-secondary-600
					bg-back-100
					rounded-tr-lg
				">
					<span class="sidenote">

						<h5 class='my-0'>
							Location
						</h5>
						<p class='text-sm mb-0 pb-1'>
							{ pageContent.data.tourn.city },
							{ pageContent.data.tourn.state || pageContent.data.tourn.country }
						</p>

						<h5 class='my-0'>
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
								class = 'blue full bg-back-200 text-primary-900 text-xs
									border-b-2 border-back-200
									hover:font-semibold
									hover:border-primary-800
								'
								href  = 'mailto:{ contact.email }'
							>
								{contact.first}
								{contact.middle}
								{contact.last}
							</a>
						{/each}

						{#if (pageContent.data.pages.length > 1)}
							<h4>Additional Information</h4>
							{#each pageContent.data.pages as page (page.id)}
								{#if page.special !== 'main'}
									<a
										class = 'blue full bg-back-200 text-primary-900 text-xs
											border-b-2 border-back-200
											hover:font-semibold
											hover:border-primary-800'
										href='/invite/{data.webname}/page/{page.title}'
									>
										{ucfirst(page.title)}
									</a>
								{/if}
							{/each}
						{/if}

					</span>

				</span>
			</div>
		{:else}
			<div class="p-8">
				<h4>No such tournament was found</h4>
				<p>Tournament ID: {data.tournId || 'None Sent'}</p>
				<p>Tournament Webname: {data.webname || 'None Sent'}</p>
			</div>
		{/if}
	{/if}
</div>
