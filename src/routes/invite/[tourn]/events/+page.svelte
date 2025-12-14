<script lang="ts">

	// This pattern leads to reactive data display in Svelte 5 & TanStack,
	// which is otherwise tricky.
	import { indexFetch } from '$lib/indexfetch';
	import { getContext } from 'svelte';

	import {eventType} from '$lib/helpers/text';

	import Sidebar from '$lib/layouts/Sidebar.svelte';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import type {Webname} from '../inviteTypes';

	const webname:Webname = getContext('webname');
	const pageContent = indexFetch( '/public/invite/', { key: webname.tournId });

	const eventPage = $derived(pageContent.data?.pages?.filter(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(webpage:any) => webpage.slug === 'events'
	));

</script>

	<div class="main">
		{#if eventPage.length === 1}
			<h5
				class='border-b-1 border-primary-500 mb-4'
			>{eventPage[0].title || 'Main' }</h5>

			{@html eventPage[0].content}
		{:else }
			<h4
				class='border-b-1 border-primary-500 mb-1'
			>Events Offered</h4>
		{/if}

		{#each pageContent.data?.events as event (event.id) }

			<div class='border-b-1 border-b-primary-600'>

				<div class='w-full flex py-1 ps-1 border-b-1 border-b-back-200'>

					<span class="w-1/2 flex grow">
						<span>
							<h5>{event.name}</h5>
						</span>
						<span class="ps-2">
							<h6>( {event.abbr} )</h6>
						</span>
					</span>

					{#if event.fieldReport}
						<span class="w-1/4 text-right content-center">
							<a
								class ='
									bg-back
									font-semibold
									px-2
									text-primary-800
									hover:text-primary-500
								'
								href  = {resolve(`${page.url.pathname}/${event.abbr}/field`, {})}
							>
								{event.entryCount || 0 } Registered Entries
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
									{pageContent.data.tourn.currency || '$'}{event.fee}
								</span>
							</div>
						{/if}

						{#if event.nsdaCode}
							<div class="px-1 flex py-1">
								<span class="w-1/3 font-semibold">
									NSDA Event
								</span>
								<span class="w-2/3 ps-2 pe-4">
									{ event.nsdaName } ({event.nsdaCode})
								</span>
							</div>
						{/if}

						{#if event.cap || event.schoolCap}
							<div class="px-1 flex py-1">
								<span class="w-1/3 font-semibold content-center">
									Entry Caps
								</span>
								<span class="w-2/3 ps-2 pe-4">
									{#if event.cap}
										<div class="ps-1 py-1 leading-3">
											Limited to {event.cap} total entries
										</div>
									{/if}

									{#if event.schoolCap}
										<div class="ps-1 py-1 leading-3">
											Limited to {event.schoolCap} entries per school
										</div>
									{/if}
								</span>
							</div>
						{/if}
					</span>

					<span class="xl:w-2/3 w-1/2">
						{#if event.topicTag}
							<div class='pb-2'>
								<div class='font-semibold ps-2 py-1 content-center'>
									Topic:
									{event.topicTag}
									{event.topicSource}
									{event.topicEventType}
								</div>

								{#if event.topicText}
									<p class='italic ps-3 py-1'>
										{event.topicText}
									</p>
								{/if}
							</div>
						{/if}

						{#if event.description}
							<div class='pb-2'>
								<div class='font-semibold ps-2 py-1 content-center'>
									Event Description
								</div>

								<p class='ps-3 py-1'>
									{@html event.description}
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
