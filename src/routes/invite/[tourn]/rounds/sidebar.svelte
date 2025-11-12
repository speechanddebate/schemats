<script lang='ts'>

	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import Sidebar from '$lib/layouts/Sidebar.svelte';
	import type {SidebarProps, PublishedRound} from '../inviteTypes';

	type RoundsListByEvent = {
		[key:string]: {
			[key:string]:PublishedRound[],
		}
	}

	let {
		rounds,
		webname,
	}: SidebarProps = $props();

	const roundsByEvent:RoundsListByEvent = {};

	for (const round of rounds) {

		if (!roundsByEvent[round.eventType]) {
			roundsByEvent[round.eventType] = {};
		}

		if (!roundsByEvent[round.eventType][round.eventAbbr]) {
			roundsByEvent[round.eventType][round.eventAbbr] = [];
		}

		roundsByEvent[round.eventType][round.eventAbbr].push(round);
	}

	let eventAbbr = $derived(page.params.eventAbbr);

</script>

	<Sidebar>
		<div class="sidenote">
			<h5 class='my-0 border-b-1 border-secondary-500 pb-0 leading-8 mb-2'>
				Events
			</h5>

			<div class='flex flex-wrap'>
				{#each Object.keys(roundsByEvent) as eventType (eventType)}

					<div class="py-1 w-full block uppercase text-back-700 text-xs">{eventType}</div>

					{#each Object.keys(roundsByEvent[eventType]) as eventKey (eventKey)}
						<a
							class = 'blue w-full bg-back-100 text-sm
								border-s-2 border-primary-400
								border-y-1 border-y-back-300
								hover:bg-back-200
								p-1
								ps-2
								text-[12px]
								flex
								{eventAbbr === eventKey ? 'selected bg-secondary-200 font-semibold' : '' }
							'
							href = { resolve(`/invite/${webname.webname}/rounds/${eventKey}`, {} ) }
						>
							<span class="grow">
								{roundsByEvent[eventType][eventKey][0].eventName}
							</span>
							<span class='min-w-[3em]
								flex
								flex-col
								justify-around
								text-right pe-[3px]
								text-back-1000 text-xs
							'>
								{eventKey}
							</span>
						</a>

						<div class='block ps-2 {eventAbbr === eventKey ? '' : 'hidden' } mb-2'>
							{#each roundsByEvent[eventType][eventKey] as round (round.roundId)}
								<a
									class = 'blue w-full
										bg-back-100 text-xs
										border-s-2 border-secondary-200
										border-y-1 border-y-back-300
										hover:bg-secondary-200
									'
									href = {resolve(`/invite/${webname}/rounds/${eventKey}/${round.roundName}`, {} )}
								>{round.eventAbbr} { round.roundLabel || `Round ${round.roundName}`}</a>
							{/each}
						</div>
					{/each}
				{/each}
			</div>
		</div>
	</Sidebar>