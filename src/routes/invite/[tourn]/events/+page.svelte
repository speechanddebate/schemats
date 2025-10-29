<script lang="ts">

	// This pattern leads to reactive data display in Svelte 5 & TanStack,
	// which is otherwise tricky.
	import { indexFetch } from '$lib/indexfetch';
	import { getContext } from 'svelte';

	import { page } from '$app/state';
	import { resolve } from '$app/paths';

	const key:string | number = getContext('inviteKey');
	const pageContent = indexFetch( '/public/invite/', { key });

	const eventPage = $derived(pageContent.data?.pages?.filter(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(webpage:any) => webpage.slug === 'events'
	));

</script>

	{#if pageContent.status === 'pending'}
		<div class='text-success-500 font-semibold'>
			Data Loading...
		</div>
	{:else if pageContent.status === 'error'}
		<span>Error: {pageContent.error.message}</span>
	{:else}

		{#if pageContent.isFetching}
			<div class='text-success-500 font-semibold'>
				Data Updating...
			</div>
		{:else}

			<div class="main">

			{#if eventPage.length === 1}
				<h5
					class='border-b-1 border-primary-500 mb-4'
				>{eventPage[0].title || 'Main' }</h5>

				{@html eventPage[0].content}
			{:else }
				<h5
					class='border-b-1 border-primary-500 mb-4'
				>Events Offered</h5>
			{/if}

			{#each pageContent.data?.events as event (event.id) }

				<div class="flex w-full ms-2 mt-2">
					<span class="flex grow">
						<h6>{event.name}</h6>
					</span>

					<span class="flex text-right pr-4">
						<h6>{event.abbr}</h6>
					</span>
				</div>

				<div class="px-2 pb-4 pt-2
					border-b-1 border-b-back-200"
				>
					<div class="flex">
						{#if event.fee}
							<p class='flex grow'>
								Entry Fee: ${event.fee}
							</p>
						{/if}

						{#if event.schoolCap}
							<p class='flex grow'>
								Limited to {event.schoolCap} entries per school
							</p>
						{/if}

						{#if event.cap}
							<p class='flex grow'>
								Limited to {event.cap} total entries
							</p>
						{/if}
					</div>

					{#if event.topicText}
						<p><span class='font-semibold'>Topic:</span>{event.topicText || 'Resolved: this sucks'}</p>
					{/if}

					{#if event.topicTag}
						<p>
							Topic:
							{event.topicSource}
							{event.topicEventType}
							{event.topicTag}
						</p>
					{/if}

					{#if event.description}
						<hr />
						<p class="py-2">
							{@html event.description}
						</p>
					{/if}

					{#if event.fieldReport}
						<a
							class = 'text-back text-md font-semibold
								bg-primary-800 rounded px-2 py-2
								hover:bg-primary-700
								inline-block
							'
							href  = {resolve(`${page.url.pathname}/${event.id}/field`, {})}
						>
							Field Report
						</a>
					{/if}

				</div>
			{/each}

			</div>

		{/if}
	{/if}

