<script lang='ts'>

	import { resolve } from '$app/paths';
	import { getContext, untrack } from 'svelte';

	import { indexFetch } from '$lib/indexfetch';
	import Sidebar from '$lib/layouts/Sidebar.svelte';
	import Loading from '$lib/layouts/Loading.svelte';

	import type { Tourn } from '$indexcards/schemas';
    import type { Event } from '$lib/indexcards/schemas';

	let {selectedResultSetId = 0, selectedEventId = 0} = $props();

	const tourn:Tourn = getContext('webnameTourn');
	const resultSets  = $derived(indexFetch(`/rest/tourns/${tourn.id}/results`));
	const myTourn     = $derived(indexFetch(`/user/tourn/${tourn.id}`));

	let selectedEvent = $state(untrack(() => selectedEventId));

	interface Bucket {
		[key: string]: Array<Event>;
	}

	const buckets:Bucket = $derived.by( () => {

		const myEvents = myTourn.data?.me?.events || [];
		const mineEvents = myTourn.data?.mine?.events || [];

		const myBuckets:Bucket = {};

		if (resultSets.data && resultSets.isFetched) {

			const events = Object.keys(resultSets.data).map( (eventId) => {
				return resultSets.data[eventId];
			}).sort( (a, b) => {

				if (myEvents.includes(b.id) && !myEvents.includes(a.id)) return 1;
				if (myEvents.includes(a.id) && !myEvents.includes(b.id)) return -1;

				if (mineEvents.includes(b.id) && !mineEvents.includes(a.id)) return 1;
				if (mineEvents.includes(a.id) && !mineEvents.includes(b.id)) return -1;

				if (a.nsdaCategory !== b.nsdaCategory) return a.nsdaCategory - b.nsdaCategory;
				if (a.level !== b.level) return b.level.localeCompare(a.level);
				if (a.type !== b.type) return a.type.localeCompare(b.type);
				if (a.abbr !== b.abbr) return a.abbr.localeCompare(b.abbr);
			});

			events.forEach( (event) => {
				if (!myBuckets[event.type]) myBuckets[event.type] = [];
				myBuckets[event.type].push(event);
			});
		}
		return myBuckets;
	});

</script>

	<Loading tanstackJobs={ [myTourn, resultSets] } />

	{#if myTourn.isFetched && resultSets.isFetched}

	<!-- invite/resultSets/eventAbbr/sidebar.svelte-->
	<Sidebar>
		<div class="sidenote">
			<h5 class='my-0 border-b border-secondary-500 pb-0 leading-8 mb-2 pt-1'>
				Events
			</h5>

			{#each Object.keys(buckets) as eventType (eventType) }
				{#each buckets[eventType] as event (event.id) }
					{#if resultSets.data[event.id].ResultSets.length > 0}

						<div class='flex flex-wrap'>
							<button
								class = 'blue w-full bg-back-100 text-sm
									border-s-2 border-primary-400
									border-y border-y-back-300
									hover:bg-back-200
									p-1
									ps-2
									text-[12px]
									flex
									mb-1
									{selectedEvent === event.id ? 'selected bg-secondary-200 font-semibold' : '' }
								'
								onclick={ () => { selectedEvent = event.id; } }
								type  ='button'
							>
								<span class="grow text-left">
									{event.name}
								</span>
								<span class='min-w-[3em]
										flex
										flex-col
										justify-aresultSet
										text-right pe-0.75
										text-back-1000 text-xs
									'>
										{event.abbr}
								</span>
							</button>

							<div class='block ps-2 {selectedEvent === event.id ? '' : 'hidden' } mb-2'>
								{#each event.ResultSets as resultSet (resultSet.id)}
									<a
										class = 'blue w-full
											bg-back-100 text-xs
											border-s-2 border-secondary-200
											border-y border-y-back-300
											hover:bg-secondary-200
											{selectedResultSetId === resultSet.id ? 'selected bg-secondary-200 ' : '' }
										'
										href = {resolve(`/invite/${tourn.webname}/results/${resultSet.id}`, {} )}
									>{ resultSet.label  }</a>
								{/each}
							</div>
						</div>
					{/if}
				{/each}
			{/each}
		</div>

	</Sidebar>
	{/if}
