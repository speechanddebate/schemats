<script lang="ts">

	// This pattern leads to reactive data display in Svelte 5 & TanStack,
	// which is otherwise tricky.
	import { indexFetch } from '$lib/indexfetch';
	import { getContext } from 'svelte';

	import {eventType} from '$lib/helpers/text';

	import Sidebar from '$lib/layouts/Sidebar.svelte';
	import Loading from '$lib/layouts/Loading.svelte';
	import { resolve } from '$app/paths';

	import type { Webpage, Tourn } from '$indexcards/schemas';
	const tourn:Tourn = getContext('webnameTourn');
	const pageContent = $derived(indexFetch(`/rest/tourns/${tourn.id}/invite`));

	const eventPage = $derived.by( () => {
		const pages = pageContent.data?.webpages?.filter(
			(webpage:Webpage) => webpage.slug === 'events'
		);

		if (pages && pages.length > 0) {
			return pages[0];
		}
	});

</script>

	<Loading tanstackJob={pageContent} />

	<div class="main">
		{#if eventPage}
			<h5
				class='border-b border-primary-500 mb-4'
			>{eventPage.title || 'Main' }</h5>

			{@html eventPage.content}
		{:else }
			<h4
				class='border-b border-primary-500 mb-1'
			>Events Offered</h4>
		{/if}

		{#each pageContent.data?.Events as event (event.id) }

			<div class='border-b border-b-primary-600'>

				<div class='w-full flex py-1 ps-1 border-b border-b-back-200'>

					<span class="w-1/2 flex grow">
						<span>
							<h5>{event.name}</h5>
						</span>
						<span class="ps-2">
							<h6>( {event.abbr} )</h6>
						</span>
					</span>

					{#if event.settings.fieldReport}
						<span class="w-1/4 text-right content-center">
							<a
								class ='
									bg-back
									font-semibold
									px-2
									text-primary-800
									hover:text-primary-500
								'
								href  = {resolve(`/invite/${tourn.webname}/events/${event.abbr}/field`, {})}
							>
								{event.metadata.entryCount || 0 } Registered Entries
							</a>
						</span>
					{/if}
				</div>

				<div class="flex w-full ms-2 mt-1 content-start">

					<span class="xl:w-1/3 w-1/2 pb-2 text-sm">
						<div class="px-1 flex py-1">
							<span class="w-1/3 font-semibold">
								Event Type
							</span>
							<span class="w-2/3 ps-2 pe-4 ">
								{eventType(event.type)}
							</span>
						</div>

						{#if event.fee}
							<div class="px-1 flex py-1">
								<span class="w-1/3 font-semibold">
									Entry Fee
								</span>
								<span class="w-2/3 ps-2 pe-4">
									{pageContent.data.currency || '$'}{event.fee}
								</span>
							</div>
						{/if}

						{#if event.NSDACategory}
							<div class="px-1 flex py-1">
								<span class="w-1/3 font-semibold">
									NSDA Event
								</span>
								<span class="w-2/3 ps-2 pe-4">
									{ event.NSDACategory.name || 'None' } ({event.NSDACategory.code})
								</span>
							</div>
						{/if}

						{#if event.settings.cap || event.settings.schoolCap}
							<div class="px-1 flex py-1">
								<span class="w-1/3 font-semibold content-center">
									Entry Caps
								</span>
								<span class="w-2/3 ps-2 pe-4">
									{#if event.settings.cap}
										<div class="ps-1 py-1 leading-3">
											Limited to {event.settings.cap} total entries
										</div>
									{/if}

									{#if event.settings.schoolCap}
										<div class="ps-1 py-1 leading-3">
											Limited to {event.settings.schoolCap} entries per school
										</div>
									{/if}
								</span>
							</div>
						{/if}
					</span>

					<span class="xl:w-2/3 w-1/2">
						{#if event.Topic?.id}
							<div class='pb-2'>
								<div class='font-semibold ps-2 py-1 content-center'>
									Topic:
									{event.Topic.tag}
									{event.Topic.source}
									{event.Topic.eventType}
								</div>

								{#if event.Topic.text}
									<p class='italic ps-3 py-1'>
										{event.Topic.text}
									</p>
								{/if}
							</div>
						{/if}

						{#if event.settings.description}
							<div class='pb-2'>
								<div class='font-semibold ps-2 py-1 content-center'>
									Event Description
								</div>

								<p class='ps-3 py-1'>
									{@html event.settings.description}
								</p>
							</div>
						{/if}
					</span>
				</div>
			</div>
		{/each}

	</div>

	<Sidebar>
		<div class="sidenote min-h-[50dvh]">
		</div>
	</Sidebar>