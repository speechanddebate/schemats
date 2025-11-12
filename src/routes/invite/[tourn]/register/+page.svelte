<script lang="ts">

	import { indexFetch } from '$lib/indexfetch';
	import { getContext } from 'svelte';
	import type {Webname} from '../inviteTypes';

	const webname:Webname = getContext('webname');
	const mySchools = indexFetch(`/public/invite/${webname.tournId}/myschools`);
	const myChapters = indexFetch(`/public/invite/${webname.tournId}/nonschools`);

</script>

	<div class="main">

		{#if (mySchools.status === 'pending' || myChapters.status == 'pending')}
			<div class='text-success-500 font-semibold'>
				Data Loading...
			</div>
		{:else if (mySchools.status === 'error' || myChapters.status == 'error')}
			<span>Error: {mySchools.error?.message}</span>
			<span>Error: {myChapters.error?.message}</span>
		{:else}

			{#if (mySchools.isFetching || myChapters.isFetching)}
				<div class='text-success-500 font-semibold'>
					Data Updating...
					mySchools {mySchools.isFetching}
					myChapters {myChapters.isFetching}
				</div>
			{:else}

				{#if (mySchools.data.length > 0) }

					<h5>Entered</h5>

					{#each mySchools.data as school (school.id) }

						<h6>{school.name}</h6>

						<p>{Object.keys(school.entries).length} active entries</p>
						<p>{ school.students.length} unique competitors</p>
						<p>{Object.keys(school.events).length} events</p>
						<p>{Object.keys(school.judges).length} judges</p>

						<h5>Competitor Roster</h5>

						{#each school.students as student (student.id) }
							<div class='w-full flex ps-4 py-1 border-b-1 border-back-200'>
								<span class="w-1/5">
									{ student.first }
								</span>
								<span class="w-1/5">
									{ student.last }
								</span>
								<span class="w-1/10">
									{ school.events[student.eventId]?.abbr }
								</span>
								<span class="w-1/4 grow">
									{ student.code }
								</span>
							</div>
						{/each}
					{/each}
				{/if}
			{/if}
		{/if}

	</div>

