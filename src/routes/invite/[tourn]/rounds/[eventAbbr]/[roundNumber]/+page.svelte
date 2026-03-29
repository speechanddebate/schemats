<script lang="ts">

	import { page } from '$app/state';
	import { getContext } from 'svelte';
	import { indexFetch } from '$lib/indexfetch';

	import Debate from '$lib/invite/schematics/Debate.svelte';
	import Speech from '$lib/invite/schematics/Speech.svelte';
	import MockTrial from '$lib/invite/schematics/MockTrial.svelte';

	import Loading from '$lib/layouts/Loading.svelte';
	import Sidebar from './sidebar.svelte';
	import Deadlines from '$lib/invite/schematics/Deadlines.svelte';
    import { ordinate } from '$lib/helpers/text';

	import type { Tourn } from '$indexcards/schemas';
	const tourn:Tourn = getContext('webnameTourn');

	let myTourn = $derived.by( () => {
		return indexFetch(`/user/tourn/${tourn.id}`);
	});

	let roundNumber = $derived(page.params.roundNumber);
	let eventAbbr = $derived(page.params.eventAbbr);

	// Page params calls must be in a derived for reactivity.
	let schematData = $derived.by( () => {
		return indexFetch(`/pages/invite/${tourn.id}/${eventAbbr}/${roundNumber}`);
	});

</script>

	<Loading tanstackJobs={ [myTourn, schematData] }></Loading>

	{#if schematData.status === 'success'}
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
							{ schematData.data.Event?.name }
						</h6>
						<h3 class='pb-1 my-0 leading-8'>
							{#if tourn.webname === 'ndt' && ['prelim', 'highlow'].includes(schematData.data.type) }
								{ `Round the ${schematData.data.name}${ ordinate(schematData.data.name)}` }
							{:else}
								{ schematData.data.label || `Round ${schematData.data.name}` }
							{/if}
						</h3>
						{#if schematData.data.message}
							<p class="px-0 font-semibold italic text-md pt-1 pb-0 leading-3 text-error-600">
								{schematData.data.message}
							</p>
						{/if}
					</div>
				</span>

				<span class="w-2/5 content-right m-0 p-0 flex flex-col justify-around">
					{#if schematData.data.times}
						<Deadlines
							times   = {schematData.data.times}
							tournTz = {schematData.data.tz}
						/>
					{/if}
				</span>
			</div>

			{#if schematData.data.motion}
				<p class="
					px-0 py-1 pb-3 mb-2
					font-semibold italic text-md leading-3
					text-primary-800
					text-center
					border-b-2 border-neutral-300
				">
					MOTION: {schematData.data.motion}
				</p>
			{/if}

			{#if
				schematData.data.Event?.type === 'speech'
				|| schematData.data.Event?.type === 'congress'
			}
				<Speech
					myTourn   = {myTourn.data}
					roundData = {schematData.data}
				/>
			{:else if schematData.data.Event?.type === 'mock_trial'}
				<MockTrial
					myTourn   = {myTourn.data}
					roundData = {schematData.data}
				/>
			{:else}
				<Debate
					myTourn   = {myTourn.data}
					roundData = {schematData.data}
				/>
			{/if}

		</div>

		<Sidebar />
	{/if}
