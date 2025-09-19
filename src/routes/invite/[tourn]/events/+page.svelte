<script lang="ts">

	// This pattern leads to reactive data display in Svelte 5 & TanStack,
	// which is otherwise tricky.
	import { idxQuery } from '$lib/helpers/utils.svelte';
	import { getContext } from 'svelte';
	import { fromStore } from 'svelte/store';

	const key:string | number = getContext('inviteKey');
	let queryStore = $derived(idxQuery({key, path: 'public/invite'}));
	let pageContent = $derived(fromStore(queryStore).current);

	import { page } from '$app/state';
	import { resolve } from '$app/paths';

	// svelte-ignore state_referenced_locally
	const eventPage = pageContent.data?.pages?.filter(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(webpage:any) => webpage.slug === 'events'
	);

</script>

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

		<div class="flex w-full border-t-1 border-t-back-200">
			<span class="flex grow">
				<h6>{event.name}</h6>
			</span>

			<span class="flex text-right pr-2">
				<h6>{event.abbr}</h6>
			</span>
		</div>

		<div class="px-2">

			{#if event.fee}
				<p>
					Entry Fee: ${event.fee}
				</p>
			{/if}

		<div class="flex">
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
			{@html event.description}
		{/if}

		{#if event.fieldReport}
			<a
				class = "underline"
				href  = {resolve(`${page.url.pathname}/${event.id}/field`, {})}
			>
				Field Report
			</a>
		{/if}

		</div>

	{/each}

