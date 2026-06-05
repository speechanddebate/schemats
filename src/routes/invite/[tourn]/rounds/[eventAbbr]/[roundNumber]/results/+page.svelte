<script lang="ts">

	import { page } from '$app/state';
	import { getContext } from 'svelte';
	import { indexFetch } from '$lib/indexfetch';

	import Ranked from './Ranked.svelte';
	import Winloss from './Winloss.svelte';

	import Loading from '$lib/layouts/Loading.svelte';
	import Sidebar from '../../../sidebar.svelte';

	import type { Tourn } from '$indexcards/schemas';
	const tourn:Tourn = getContext('webnameTourn');

	let myTourn = $derived.by( () => {
		return indexFetch(`/user/tourn/${tourn.id}`);
	});

	let roundNumber = $derived(page.params.roundNumber);
	let eventAbbr   = $derived(page.params.eventAbbr);

	// Page params calls must be in a derived for reactivity.
	let results = $derived(indexFetch(`/pages/invite/${tourn.id}/${eventAbbr}/${roundNumber}/results`));

</script>

	<Loading tanstackJobs={ [myTourn, results] }></Loading>

	{#if results.status === 'success'}

		<div class="main">
			<div class="
				flex
				bt-0 mt-0
				border-b-2 border-primary-600
				pb-2 mb-2
			">
				<span class="w-3/5">
					<div class="flex flex-col justify-between h-full pb-1">
						<h4 class='py-0 leading-8 pb-0.5'>
							{ results.data.Event?.name }
						</h4>
						{#if results.data.message}
							<p class="px-0 font-semibold italic text-md pt-1 pb-0 leading-3 text-error-600">
								{results.data.message}
							</p>
						{/if}
					</div>
				</span>

				<span class="w-2/5 content-right m-0 p-0 flex flex-col justify-around">
					<h5 class='text-right pe-2'>Posted Results</h5>
				</span>
			</div>

			{#if results.data.motion}
				<p class="
					px-0 py-1 pb-3 mb-2
					font-semibold italic text-md leading-3
					text-primary-800
					text-center
					border-b-2 border-neutral-300
				">
					MOTION: {results.data.motion}
				</p>
			{/if}

			{#if results.data.Event?.Settings?.primaryScore === 'winloss' }
				<Winloss
					results = {results.data}
					tourn   = {tourn}
				/>
			{:else if results.data.Event?.Settings?.primaryScore === 'rank' }
				<Ranked
				/>
			{:else}

				<h5 class="font-semibold text-center py-2">
					This round's results are not yet available
				</h5>

				<p class="text-center">
					Hey, could you do our servers a solid?  Don't refresh this
					page every sixteen microseconds. Tabroom will now auto
					refresh!
				</p>
			{/if}

		</div>

		<Sidebar parent='results' />
	{/if}