<script lang="ts">

	import { page } from '$app/state';
	import { getContext } from 'svelte';
	import { indexFetch } from '$lib/indexfetch';

	import Debate from './Debate.svelte';
	import Speech from './Speech.svelte';
	import MockTrial from './MockTrial.svelte';
	import Deadlines from './Deadlines.svelte';

	import Loading from '$lib/layouts/Loading.svelte';
	import Sidebar from '../../sidebar.svelte';
    import { ordinate } from '$lib/helpers/text';

	import type { Tourn } from '$indexcards/schemas';
	const tourn:Tourn = getContext('webnameTourn');

	let myTourn = $derived.by( () => {
		return indexFetch(`/user/tourn/${tourn.id}`);
	});

	let roundNumber = $derived(page.params.roundNumber);
	let eventAbbr   = $derived(page.params.eventAbbr);

	// Page params calls must be in a derived for reactivity.
	let schematic = $derived(indexFetch(`/pages/invite/${tourn.id}/${eventAbbr}/${roundNumber}`));

</script>

	<Loading tanstackJobs={ [myTourn, schematic] }></Loading>

	{#if schematic.status === 'success'}
		<div class="main">

			<div class="
				flex
				bt-0 mt-0
				border-b-2 border-primary-600
				pb-2 mb-2
			">
				<span class="w-3/5">
					<div class="flex flex-col justify-between h-full pb-1">
						<h6 class='py-0 leading-8 pb-0.5'>
							{ schematic.data.Event?.name }
						</h6>
						<h3 class='pb-1 my-0 leading-8'>
							{#if tourn.webname === 'ndt' && ['prelim', 'highlow'].includes(schematic.data.type) }
								{ `Round the ${schematic.data.name}${ ordinate(schematic.data.name)}` }
							{:else}
								{ schematic.data.label || `Round ${schematic.data.name}` }
							{/if}
						</h3>
						{#if schematic.data.message}
							<p class="px-0 font-semibold italic text-md pt-1 pb-0 leading-3 text-error-600">
								{schematic.data.message}
							</p>
						{/if}
					</div>
				</span>

				<span class="w-2/5 content-right m-0 p-0 flex flex-col justify-around">
					{#if schematic.data.times}
						<Deadlines
							times   = {schematic.data.times}
							tournTz = {schematic.data.tz}
						/>
					{/if}
				</span>
			</div>

			{#if schematic.data.motion}
				<p class="
					px-0 py-1 pb-3 mb-2
					font-semibold italic text-md leading-3
					text-primary-800
					text-center
					border-b-2 border-neutral-300
				">
					MOTION: {schematic.data.motion}
				</p>
			{/if}

			{#if
				schematic.data.Event?.type === 'speech'
				|| schematic.data.Event?.type === 'congress'
			}
				<Speech
					myTourn   = {myTourn.data}
					schematic = {schematic.data}
					tourn     = {tourn}
				/>
			{:else if schematic.data.Event?.type === 'mock_trial'}
				<MockTrial
					myTourn   = {myTourn.data}
					schematic = {schematic.data}
				/>
			{:else}
				<Debate
					myTourn   = {myTourn.data}
					schematic = {schematic.data}
					tourn     = {tourn}
				/>
			{/if}

		</div>

		<Sidebar />
	{/if}
