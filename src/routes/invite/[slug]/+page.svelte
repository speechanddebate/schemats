<script lang="ts">

	// Tournament Invitation Main Page.

	import { fromStore } from 'svelte/store';
	import { idxQuery } from '$lib/helpers/utils.svelte';
	import ShowDate from '$lib/layouts/ShowDate.svelte';
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
				class = "px-4 flex min-h-[80vh] override"
			>
				<span
					class="
						pt-4 pr-4
						w-[75%] resize-x grow
						content-start
					"
				>
					<h2 class='text-center border-error-600 border-t'>
						{ pageContent.data.tourn.name }
					</h2>

					<div class='flex py-4 border-primary-900 border-y'>
						<span class='w-1/2 text-left'>
							<h4 class='py-0'>
								{ pageContent.data.tourn.city },
								{ pageContent.data.tourn.state || pageContent.data.tourn.country }
							</h4>
						</span>

						<span class='w-1/2 text-right'>
							<ShowDateRange
								divClass   = 'text-right flex flex-wrap'
								dtEndISO   = { pageContent.data.tourn.end }
								dtStartISO = { pageContent.data.tourn.start }
								format     = 'medday'
								mode       = 'datetime'
								showTz     = { true }
								spanClass  = 'w-full text-right grow pb font-semibold'
								tz         = { pageContent.data.tourn.tz }
							/>
						</span>
					</div>

					{#each pageContent.data.pages as page}
						{#if page.special === 'main'}
							{@html page.content}
						{/if}
					{/each}

					{#each pageContent.data.events as event}
						<h5>{event.name}</h5>
						<p>{event.abbr}</p>
						<p>${event.fee}</p>
						<p>{@html event.description}</p>
					{/each}

				</span>
				<span class="
					menu
					resize-x w-[25%]
					p-2 pl-4 pr-0
					content-start
					border-l-2 border-back-100
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
										href="{page.id}"
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
