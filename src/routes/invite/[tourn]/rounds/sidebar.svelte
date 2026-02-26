<script lang='ts'>
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { ucfirst } from '$lib/helpers/text';
	import Sidebar from '$lib/layouts/Sidebar.svelte';
	import type {SidebarProps, RoundData} from '../inviteTypes';

//	import type {SidebarProps, RoundData} from '../inviteTypes';
//	type RoundsListByEvent = {
//		[key:string]: {
//			[key:string]:RoundData[],
//		}
//	}

	let {
		rounds,
		webname,
		schools,
	}: SidebarProps = $props();

	type RoundTypeList = { [key: string] : Array<RoundData> };
	type RoundList     = { [key: string] : RoundTypeList };
	type MyRounds      = { [key: string] : RoundList };

	let multiple = $state(false);

	let roundsByEvent:MyRounds = $derived.by( () => {

		// stfu
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let rawEvents:Array<any> = [];

		// stfu
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		schools?.forEach( (school:any) => {
			rawEvents = rawEvents.concat(school.events );
		});

		const uniqEvents = [...new Set([...rawEvents])];

		const rawRounds:MyRounds = {
			your   : {},
			school : {},
			other  : {},
		};

		for (const round of rounds) {

			// local variable here is just to shut up Typescript because it
			// can't handle [key] accessors.  Sigh. What is wrong with
			// Typescript people?

			if (!round.Event) continue;

			if (uniqEvents[round.eventId]) {
				let localSet = rawRounds.school![round.Event.type];
				if (!localSet) localSet = {};
				if (!localSet[round.Event.abbr]) localSet[round.Event.abbr] = [];

				localSet[round.Event.abbr].push(round);
				rawRounds.school![round.Event.type] = localSet;
				multiple = true;
			} else if(round.eventId) {
				let otherSet = rawRounds.other![round.Event.type];
				if (!otherSet) otherSet = {};
				if (!otherSet[round.Event.abbr]) otherSet[round.Event.abbr] = [];
				otherSet[round.Event.abbr].push(round);
				rawRounds.other![round.Event.type] = otherSet;
			}
		}

		return rawRounds;
	});

	let selectedEventAbbr = $derived(page.params.eventAbbr);

</script>

	<Sidebar>
		<div class="sidenote">

			{#each ['your', 'school', 'other'] as eventKey (eventKey) }

				{#if Object.keys(roundsByEvent[eventKey])
					&& Object.keys(roundsByEvent[eventKey]).length > 0
				}

					<h5 class='my-0 border-b-1 border-secondary-500 pb-0 leading-8 mb-2 pt-1'>
						{multiple ? ucfirst(eventKey) : ''} Events
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
										{roundsByEvent[eventKey][eventType][eventAbbr][0].Event?.name}
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
									{#each roundsByEvent[eventKey][eventType][eventAbbr] as round (round.id)}
										<a
											class = 'blue w-full
												bg-back-100 text-xs
												border-s-2 border-secondary-200
												border-y-1 border-y-back-300
												hover:bg-secondary-200
											'
											href = {resolve(`/invite/${webname.webname}/rounds/${eventAbbr}/${round.name}`, {} )}
										>{round.Event?.abbr} { round.label || `Round ${round.name}`}</a>
									{/each}
								</div>
							{/each}
						{/each}
					</div>
				{/if}
			{/each}
		</div>

	</Sidebar>
