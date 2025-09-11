<script lang="ts">

	// Tournament Invitation Main Page.  Loads the basic tournament information
	// and creates the shell of the rest of the interface

	import Tabs from '$lib/layouts/Tabs.svelte';
	import TabItem from '$lib/layouts/TabItem.svelte';
	import { idxQuery } from '$lib/helpers/utils.svelte';
	import { fromStore } from 'svelte/store';
	
	import ShowDateRange from '$lib/layouts/ShowDateRange.svelte';
	import { ucfirst } from '$lib/helpers/text';
	import { page } from '$app/state';

	const data = {
		tournId : parseInt(page.params.slug || '0'),
		webname : page.params.slug,
	};

	// This pattern leads to reactive data display in Svelte 5 & TanStack,
	// which is otherwise tricky.

	let key = $state(data.tournId || data.webname);
	let queryStore = $derived(idxQuery({key, path: 'public/invite'}));
	let pageContent = $derived(fromStore(queryStore).current);


</script>

	<div>
		<Tabs>
			{#each pageContent.data.pages as webpage (webpage.id)}
				{#if webpage.special}
					<TabItem
						open  = { webpage.title === 'main' ? true : false }
						title = { ucfirst(webpage.title) || ucfirst(webpage.special)}
					>
						<div
							class = "ps-4 pe-2 min-h-[70vh]"
						>
							<h5 class='
								border-b-1 border-primary-600
								mb-4
							'>{ucfirst(webpage.title) || ucfirst(webpage.special)}</h5>
							{@html webpage.content}
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

			<TabItem title = 'Rounds'>
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
