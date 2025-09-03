<script lang="ts">
	// Tournament Invitation Main Page.
	import { Tabs, TabItem } from 'flowbite-svelte';

	import { fromStore } from 'svelte/store';
	import { idxQuery } from '$lib/helpers/utils.svelte';
	import ShowDateRange from '$lib/layouts/ShowDateRange.svelte';

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
				class = "flex min-h-[80vh] override"
			>
				<span
					class="
						content-start
						w-[75%] resize-x grow
						bg-back-200
						rounded-tl-lg
					"
				>
					<div class = "
						pt-4 pl-8 pr-2 pb-4
						w-full
					">
						<h3 class='text-left font-semibold'>
							{ pageContent.data.tourn.name }
						</h3>

						<div class='py'>
							<h4 class='py-0'>
								{ pageContent.data.tourn.city },
								{ pageContent.data.tourn.state || pageContent.data.tourn.country }
							</h4>
						</div>

						<div class='py'>
							<ShowDateRange
								dateClass  = 'pr-8 pb font-semibold'
								divClass   = 'flex w-full align-middle'
								dtEndISO   = { pageContent.data.tourn.end }
								dtStartISO = { pageContent.data.tourn.start }
								format     = 'medday'
								mode       = 'datetime'
								showTz     = { true }
								timeClass  = 'pl-2 italic text-sm align-middle'
								tz         = { pageContent.data.tourn.tz }
							/>
						</div>
					</div>
					<Tabs>
						{#each pageContent.data.pages as page}

							<TabItem
								open  = { page.title === 'main' ? true : false }
								title = {page.title}
							>
								<div
									class = "bg-back pt-4 pb-8 ps-4 pe-2 min-h-[70vh]"
								>
									<h5 class='
										border-b-1 border-primary-600
									'>{page.title}</h5>
									{@html page.content}
								</div>
							</TabItem>
						{/each}

						<TabItem
							title = "Events"
						>
							<div
								class = "bg-back pt-4 pb-8 ps-4 pe-2 min-h-[70vh]"
							>
								<h5 class='
									border-b-1 border-primary-600
								'>Events and Divisions</h5>
								{#each pageContent.data.events as event}
									<h6>{event.name}</h6>
									<p>{event.abbr}</p>
									<p>${event.fee}</p>
									<p>{@html event.description}</p>
								{/each}
							</div>
						</TabItem>

					</Tabs>

				</span>
				<span class="
					menu
					resize-x
					w-[25%]
					p-2
					content-start
					border-l-2 border-back-400
					bg-back-100
					rounded-tr-lg
				">
					<span class="sidenote">
						<h4>Tournament Contacts</h4>

						{#each pageContent.data.contacts as contact}
							<a
								class = "green blue full"
								href  = "mailto:{ contact.email }"
							>
								{contact.first}
								{contact.middle}
								{contact.last}
							</a>
						{/each}

						{#if (pageContent.data.pages.length > 1)}
							<h4>Additional Information</h4>
							{#each pageContent.data.pages as page}
								{#if page.special !== 'main'}
									<a
										class="blue full"
										href="/invite/{data.webname}/page/{page.title}"
									>
										{page.title}
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
