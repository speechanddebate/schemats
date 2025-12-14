<script lang="ts">

	// This pattern leads to reactive data display in Svelte 5 & TanStack,
	// which is otherwise tricky.

	import { page } from '$app/state';

	import { indexFetch } from '$lib/indexfetch';
	import { getContext } from 'svelte';
	import Sidebar from '../sidebar.svelte';

	import type { Webname } from '../../inviteTypes';
    import ShowDate from '$lib/layouts/ShowDate.svelte';

	const webname:Webname = getContext('webname');
	let schedule = indexFetch('/public/invite', {key: `${webname.tournId}/schedule`});
	let roundList = indexFetch('/public/invite', {key: `${webname.tournId}/rounds`});

	const eventAbbr = $derived(page.params.eventAbbr);
	const rounds = $derived(schedule.data.filter(
		(round) => round.eventAbbr === eventAbbr
	));

	const mySchools = indexFetch(`/public/invite/${webname.tournId}/myschools`);

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
								format = 'dayonly'
							/>
						</span>
						<span class="w-1/6 grow">
							<ShowDate
								dtISO  = {round.startTime || round.timeslotStart}
								format = 'short'
								mode   = 'time'
							/>
						</span>

						<span class="w-1/8 text-xs text-right pe-2">
							{ round.published ? 'Published' : 'No' }
						</span>
					</div>
				{/each}
			{/if}
		{/if}
	</div>

	{#if roundList.status === 'success'}
		<Sidebar
			rounds  = {roundList.data}
			webname = {webname}
			schools = {mySchools.data}
		/>
	{/if}
