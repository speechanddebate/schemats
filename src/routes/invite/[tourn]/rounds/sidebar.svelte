<script lang='ts'>

	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { ucfirst } from '$lib/helpers/text';
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
		schools,
	}: SidebarProps = $props();

	let schoolEvents = {};

	if (schools) {
		for (const school of schools) {
			schoolEvents = { ...school.events, ...schoolEvents };
		}
	}

	const roundsByEvent = {
		your     : {},
		school : {},
		other  : {},
	};

	let multiple = false;

	for (const round of rounds) {
		if (schoolEvents[round.eventId]) {
			if (!roundsByEvent['school'][round.eventType]) {
				roundsByEvent['school'][round.eventType] = {};
			}
			if (!roundsByEvent['school'][round.eventType][round.eventAbbr]) {
				roundsByEvent['school'][round.eventType][round.eventAbbr] = [];
			}
			roundsByEvent['school'][round.eventType][round.eventAbbr].push(round);
			multiple = true;
		} else {
			if (!roundsByEvent['other'][round.eventType]) {
				roundsByEvent['other'][round.eventType] = {};
			}
			if (!roundsByEvent['other'][round.eventType][round.eventAbbr]) {
				roundsByEvent['other'][round.eventType][round.eventAbbr] = [];
			}
			roundsByEvent['other'][round.eventType][round.eventAbbr].push(round);
		}
	}

	let selectedEventAbbr = $derived(page.params.eventAbbr);

</script>

	<Sidebar>

		<div class="sidenote">

			{#each ['your', 'school', 'other'] as eventKey (eventKey) }

				{#if Object.keys(roundsByEvent[eventKey]) && Object.keys(roundsByEvent[eventKey]).length > 0}

					<h5 class='my-0 border-b-1 border-secondary-500 pb-0 leading-8 mb-2 pt-1'>
						{multiple ? ucfirst(eventKey) : ""} Events
					</h5>

					<div class='flex flex-wrap pb-3'>

						{#each Object.keys(roundsByEvent[eventKey]) as eventType (eventType)}

							<div class="py-1 w-full block uppercase text-back-700 text-xs">
								{eventType}
							</div>

							{#each Object.keys(roundsByEvent[eventKey][eventType]) as eventAbbr (eventAbbr)}

								<a
									class = 'blue w-full bg-back-100 text-sm
										border-s-2 border-primary-400
										border-y-1 border-y-back-300
										hover:bg-back-200
										p-1
										ps-2
										text-[12px]
										flex
										{selectedEventAbbr === eventAbbr ? 'selected bg-secondary-200 font-semibold' : '' }
									'
									href = { resolve(`/invite/${webname.webname}/rounds/${eventAbbr}`, {} ) }
								>
									<span class="grow">
										{roundsByEvent[eventKey][eventType][eventAbbr][0].eventName}
									</span>
									<span class='min-w-[3em]
										flex
										flex-col
										justify-around
										text-right pe-[3px]
										text-back-1000 text-xs
									'>
										{eventAbbr}
									</span>
								</a>

								<div class='block ps-2 {selectedEventAbbr === eventAbbr ? '' : 'hidden' } mb-2'>
									{#each roundsByEvent[eventKey][eventType][eventAbbr] as round (round.roundId)}
										<a
											class = 'blue w-full
												bg-back-100 text-xs
												border-s-2 border-secondary-200
												border-y-1 border-y-back-300
												hover:bg-secondary-200
											'
											href = {resolve(`/invite/${webname.webname}/rounds/${eventAbbr}/${round.roundName}`, {} )}
										>{round.eventAbbr} { round.roundLabel || `Round ${round.roundName}`}</a>
									{/each}
								</div>
							{/each}
						{/each}
					</div>
				{/if}
			{/each}
		</div>

	</Sidebar>