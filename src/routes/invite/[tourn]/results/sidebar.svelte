<script lang='ts'>

	import { resolve } from '$app/paths';
	import { getContext, untrack } from 'svelte';

	import { indexFetch } from '$lib/indexfetch';
	import { handleOrval } from '$lib/helpers/query';
	import Sidebar from '$lib/layouts/Sidebar.svelte';
	import { Spinner } from 'flowbite-svelte';
	import { page } from '$app/state';

	import type { Tourn, ResultSetEvent } from '$indexcards/schemas';
    import { createGetTournResultSets } from '$indexcards';

	const selectedResultSetId = $derived(Number(page.params.resultSetId));
	const tourn:Tourn = getContext('webnameTourn');
	// the query object is basically what gets returned from indexFetch except it is strongly typed to all potential responses
	const resultsQuery = createGetTournResultSets(() => tourn.id);
	//handleOrval handles all query errors and problem responses. if a specific problem is expected (like NotFound), it can
	// be overridden and handled by the page. the result is either the successful payload, or null.
	const resultSets = $derived(handleOrval(resultsQuery));
	const myTourn     = $derived(indexFetch(`/user/tourn/${tourn.id}`));

	let selectedEvent = $state(untrack(() => {
		if (!resultSets || selectedResultSetId === 0) return 0;

		for (const eventId in resultSets) {
			const event = resultSets[eventId];
			if (event.ResultSets?.some(rs => rs.id === selectedResultSetId)) {
				return event.id;
			}
		}
		return 0;
	}));

	interface Bucket {
		[key: string]: Array<ResultSetEvent>;
	}

	const buckets = $derived.by( () => {

		const myEvents = myTourn.data?.me?.events || [];
		const mineEvents = myTourn.data?.mine?.events || [];

		const myBuckets:Bucket = {};

		if (resultSets) {

			const events = Object.keys(resultSets).map( (eventId) => {
				return resultSets[Number(eventId)];
			}).sort( (a, b) => {

				if (myEvents.includes(b.id) && !myEvents.includes(a.id)) return 1;
				if (myEvents.includes(a.id) && !myEvents.includes(b.id)) return -1;

				if (mineEvents.includes(b.id) && !mineEvents.includes(a.id)) return 1;
				if (mineEvents.includes(a.id) && !mineEvents.includes(b.id)) return -1;

				if (a.nsdacategory !== b.nsdacategory) return a.nsdacategory - b.nsdacategory;
				if (a.level !== b.level) return b.level.localeCompare(a.level);
				if (a.type !== b.type) return a.type.localeCompare(b.type);
				if (a.abbr !== b.abbr) return a.abbr.localeCompare(b.abbr);
				return 0;
			});

			events.forEach( (event) => {
				if (!myBuckets[event.type]) myBuckets[event.type] = [];
				myBuckets[event.type].push(event);
			});
		}
		return myBuckets;
	});

</script>
	<!-- invite/resultSets/eventAbbr/sidebar.svelte-->
	<Sidebar>
		<div class="sidenote">
			<h5 class='my-0 border-b border-secondary-500 pb-0 leading-8 mb-2 pt-1'>
				Events
			</h5>
			{#if resultsQuery.isPending || myTourn.isPending}
			<Spinner color="blue" type="bars" />
			{:else if resultSets}
			{#each Object.keys(buckets) as eventType (eventType) }
				{#each buckets[eventType] as event (event.id) }
					{#if (resultSets[event.id]?.ResultSets?.length ?? 0) > 0}

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
										href = {resolve(`/invite/${tourn.webname}/results/${resultSet.id}`)}
									>{ resultSet.label  }</a>
								{/each}
							</div>
						</div>
					{/if}
				{/each}
			{/each}
			{:else}
			<p>No Results for this tournament</p>
			{/if}
		</div>

	</Sidebar>
