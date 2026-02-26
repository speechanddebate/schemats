<script lang="ts">

	import { page } from '$app/state';
	import { getContext } from 'svelte';

	import { indexFetch } from '$lib/indexfetch';

	import Debate from '$lib/invite/schematics/Debate.svelte';
	import Speech from '$lib/invite/schematics/Speech.svelte';
	import MockTrial from '$lib/invite/schematics/MockTrial.svelte';

	import Loading from '$lib/layouts/Loading.svelte';
	import Sidebar from '../../sidebar.svelte';
	import Deadlines from '$lib/invite/schematics/Deadlines.svelte';

	import type { Webname } from '../../../inviteTypes';

	const webname:Webname = getContext('webname');
	const roundList = indexFetch(`/rest/tourns/${webname.tournId}/rounds`);
	const mySchools = indexFetch(`/user/chapter/byTourn/${webname.tournId}/mySchools`);

	// Page params calls must be in a derived for reactivity.
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const schematData = $derived.by( () => {
		return indexFetch(`/pages/invite/${webname.tournId}/${page.params.eventAbbr}/${page.params.roundNumber}`);
	});

</script>

	<Loading tanstackJobs={ [schematData, roundList, mySchools] }></Loading>

	{#if schematData.status === 'success'}
		<div class="main">

			<div class="
				flex
				border-b-2 border-primary-600
				pb-2 mb-2
			">
				<span class="w-3/5">
					<div class="flex flex-col justify-between h-full pb-2">
						<h4 class='py-0 my-1 leading-8 pb-1'>
							{ schematData.data.Event?.name }
						</h4>
						<h3 class='py-1 my-0 leading-8'>
							{ schematData.data.label || `Round ${schematData.data.name}` }
						</h3>
						{#if schematData.data.message}
							<p class="px-0 font-semibold italic text-md pt-1 pb-0 leading-2 text-error-600">
								{schematData.data.message}
							</p>
						{/if}
					</div>
				</span>

				<span class="w-2/5 content-right m-0 p-0">
					<Deadlines
						times   = {schematData.data.times}
						tournTz = {schematData.data.tz}
					/>
				</span>
			</div>

			{#if schematData.data.motion}
				<p class="
					px-0 py-1 pb-3 mb-2
					font-semibold italic text-md leading-2
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
				<Speech roundData={schematData.data} />
			{:else if schematData.data.Event?.type === 'mocktrial'}
				<MockTrial roundData={schematData.data} />
			{:else}
				<Debate roundData={schematData.data} />
			{/if}

			<pre>{ JSON.stringify(schematData.data, null, 2) }</pre>
		</div>

		{#if roundList.status === 'success'}
			<Sidebar
				rounds  = {roundList.data}
				schools = {mySchools.data}
				webname = {webname}
			/>
		{/if}
	{/if}
