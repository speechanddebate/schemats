<script lang="ts">

	// This pattern leads to reactive data display in Svelte 5 & TanStack,
	// which is otherwise tricky.

	import { page } from '$app/state';
	import { resolve } from '$app/paths';

	import { indexFetch } from '$lib/indexfetch';
	import { getContext } from 'svelte';
	import Sidebar from '../sidebar.svelte';

	import type { RoundData, Webname } from '../../inviteTypes';
    import ShowDate from '$lib/layouts/ShowDate.svelte';

	const webname:Webname = getContext('webname');
	let schedule = indexFetch(`/rest/tourns/${webname.tournId}/schedule`);
	let roundList = indexFetch(`/rest/tourns/${webname.tournId}/rounds`);
	const mySchools = indexFetch(`/user/chapter/byTourn/${webname.tournId}/mySchools`);

	const eventAbbr = $derived(page.params.eventAbbr);

	const rounds = $derived(schedule.data.filter(
		(round:RoundData) => round.Event?.abbr === eventAbbr
	));

</script>

	<div class="main">
		{#if schedule.status === 'pending'}
			<div class='text-success-500 font-semibold'>
				Data Loading...
			</div>
		{:else if schedule.status === 'error'}
			<span>Error: {schedule.error.message}</span>
		{:else}

			{#if schedule.isFetching}
				<div class='text-success-500 font-semibold'>
					Data Updating...
				</div>
			{:else}

				<h5>{eventAbbr} Event Schedule</h5>

				{#each rounds as round (round.id) }

					<div class="flex border-t-1 border-neutral-400 w-full py-2">
						<span class="w-1/4 ps-1">
							{ round.label || `Round ${round.name}` }
						</span>

						<span class="w-1/4 capitalize">
							{ round.type }
						</span>

						<span class="w-1/10">
							<ShowDate
								dtISO  = {round.startTime || round.timeslotStart}
								format = 'dayOnly'
								mode   = 'date'
							/>
						</span>
						<span class="w-1/6">
							<ShowDate
								dtISO  = {round.startTime || round.timeslotStart}
								format = 'short'
								mode   = 'time'
							/>
						</span>

						<span class="w-1/6 grow text-xs text-right pe-2">
							<a class='flexrow'
								href= { resolve(`/invite/${ webname.webname }/rounds/${ round.Event.abbr}/${round.name}`, {} ) }
							>
								{ round.published == 1 ? 'Published' : '' }
							</a>
							<a class='flexrow'
								href= { resolve(`/invite/${ webname.webname }/results/${ round.Event.abbr}/${round.name}`, {} ) }
							>
								{ round.postPrimary ? 'Results Posted' : '' }
							</a>
						</span>
					</div>
				{/each}
			{/if}
		{/if}
	</div>

	{#if roundList.status === 'success'}
		<Sidebar
			rounds  = {roundList.data}
			schools = {mySchools.data}
			webname = {webname}
		/>
	{/if}
