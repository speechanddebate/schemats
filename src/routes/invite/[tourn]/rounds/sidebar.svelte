<script lang='ts'>
	/* eslint-disable @typescript-eslint/no-explicit-any */

	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { getContext } from 'svelte';

	import { indexFetch } from '$lib/indexfetch';
	import { ucfirst } from '$lib/helpers/text';
	import Sidebar from '$lib/layouts/Sidebar.svelte';
	import Loading from '$lib/layouts/Loading.svelte';

	import type {RoundData, Webname} from '../inviteTypes';

	const webname:Webname = getContext('webname');
	const roundList       = indexFetch(`/rest/tourns/${webname.tournId}/rounds`);
	const myTourn         = indexFetch(`/user/tourn/${webname.tournId}`);

	let events:any = $derived.by( () => {

		if (!myTourn.isFetched) return;
		if (!roundList.isFetched) return;

		const myEvents = myTourn.data?.me.events;
		const mineEvents = myTourn.data?.mine.events;
		const rawEvents:any = {
			your   : {},
			school : {},
			other  : {},
		};

		const done: number[] = [];

		roundList.data.forEach( (round:RoundData) => {

			if (!round.Event?.id) return;
			if (done.includes(round.Event.id)) return;
			let tag = 'other';

			if (myEvents.includes(round.Event.id)) tag = 'your';
			if (mineEvents.includes(round.Event.id)) tag = 'school';

			rawEvents[tag][round.Event.id] = round.Event;
			done.push(round.Event.id);
		});

		return rawEvents;
	});

	let multiple = $derived.by( () => {
		if (!myTourn.isFetched) return;
		if (Object.keys(events.your).length) return 1;
		if (Object.keys(events.school).length) return 1;
	});

	const roundsByEvent = $derived.by( () => {
		if (!myTourn.isFetched) return;
		if (!roundList.isFetched) return;

		const eventBins:any = {};
		roundList.data.forEach( (round:RoundData) => {
			if (!eventBins[round.eventId]) {
				eventBins[round.eventId] = [];
			}
			eventBins[round.eventId].push(round);
		});
		return eventBins;
	});

	let selectedEventAbbr = $derived(page.params.eventAbbr);
	let selectedRoundNumber = $derived(parseInt(page.params.roundNumber));

</script>

	<Loading tanstackJobs={ [myTourn, roundList] } />

	{#if myTourn.isFetched}
	<Sidebar>
		<div class="sidenote">
			{#each ['your', 'school', 'other'] as key (key) }

				{#if Object.keys(events[key]).length}

					<h5 class='my-0 border-b-1 border-secondary-500 pb-0 leading-8 mb-2 pt-1'>
						{multiple ? ucfirst(key) : ''} Events
					</h5>

					{#each Object.keys(events[key]).sort( (a,b) => {

						const eA = events[key][a];
						const eB = events[key][b];

						if (eA.type !== eB.type)
							return (eA.type).localeCompare(eB.type);

						if (eA.nsdaCategory !== eB.nsdaCategory)
							return eA.nsdaCategory - eB.nsdaCategory;

						if (eA.abbr && eB.abbr)
							return (eA.abbr).localeCompare(eB.abbr);
					}) as id (id) }

						<div class='flex flex-wrap'>
							<a
								class = 'blue w-full bg-back-100 text-sm
									border-s-2 border-primary-400
									border-y-1 border-y-back-300
									hover:bg-back-200
									p-1
									ps-2
									text-[12px]
									flex
									{selectedEventAbbr === events[key][id]?.abbr ? 'selected bg-secondary-200 font-semibold' : '' }
								'
								href = { resolve(`/invite/${webname.webname}/rounds/${events[key][id].abbr}`, {} ) }
							>
								<span class="grow">
									{events[key][id].name}
								</span>
								<span class='min-w-[3em]
									flex
									flex-col
									justify-around
									text-right pe-[3px]
									text-back-1000 text-xs
								'>
									{events[key][id].abbr}
								</span>
							</a>

							<div class='block ps-2 {selectedEventAbbr === events[key][id].abbr ? '' : 'hidden' } mb-2'>
								{#each roundsByEvent[id] as round (round.id)}
									<a
										class = 'blue w-full
											bg-back-100 text-xs
											border-s-2 border-secondary-200
											border-y-1 border-y-back-300
											hover:bg-secondary-200
											{myTourn.data?.me.rounds.includes(round.id) ? 'text-warning-600 font-semibold' : '' }
											{selectedRoundNumber === round.name ? 'selected bg-secondary-200 ' : '' }
										'
										href = {resolve(`/invite/${webname.webname}/rounds/${events[key][id].abbr}/${round.name}`, {} )}
									>{#if myTourn.data?.me.rounds.includes(round.id) }
										{@html '&#x21e8;'}
									{/if}
									{ events[key][id].abbr } { round.label || `Round ${round.name}`}</a>
								{/each}
							</div>
						</div>
					{/each}
				{/if}
			{/each}
		</div>
	</Sidebar>
	{/if}
