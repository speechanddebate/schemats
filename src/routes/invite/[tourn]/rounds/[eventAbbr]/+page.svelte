<script lang="ts">

	import sidebar from './sidebar.svelte';
	import { idxQuery } from '$lib/helpers/utils.svelte';
	import { fromStore } from 'svelte/store';

	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { setContext, getContext } from 'svelte';

	const data = {
		tournId : parseInt(page.params.tourn || '0'),
		webname : page.params.tourn,
	};

	// This pattern leads to reactive data display in Svelte 5 & TanStack,
	// which is otherwise tricky. It cost me dearly to discover this wisdom.

	let key = $state(data.tournId || data.webname);
	let queryStore = $derived(idxQuery({key, path: 'public/invite'}));
	let pageContent = $derived(fromStore(queryStore).current);

	let queryRounds = $derived(idxQuery({key: `${data.tournId}/rounds`, path: `public/invite`}));
	let rounds = $derived(fromStore(queryRounds).current);

	let currentEvent = '';

	if (page.params.eventAbbr) {
		setContext('currentInviteEvent', page.params.eventAbbr);
		currentEvent = page.params.eventAbbr;
	} else {
		currentEvent = getContext('inviteEvent', page.params.currentEvent);
	}

	// svelte-ignore state_referenced_locally
	const eventPage = pageContent.data?.pages?.filter(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(webpage:any) => webpage.slug === 'events'
	);
</script>

	{#if eventPage.length === 1}
		<h5
			class='border-b border-primary-500 mb-4'
		>{eventPage[0].title || 'Main' }</h5>

		{@html eventPage[0].content}
	{:else }
		<h5
			class='border-b border-primary-500 mb-4'
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
			border-b border-b-back-200"
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
				{@html event.description}
			{/if}

			{#if event.fieldReport}
				<a
					class = "text-primary-700 text-md ps-1"
					href  = {resolve(`${page.url.pathname}/${event.id}/field`, {})}
				>
					Field Report
				</a>
			{/if}
		</div>
	{/each}

