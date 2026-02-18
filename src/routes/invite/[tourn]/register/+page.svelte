<script lang='ts'>

	// eslint-disable-file max-len

	import { indexFetch } from '$lib/indexfetch';
	import { getContext } from 'svelte';
	import type {Webname} from '../inviteTypes';
	import ShowDate from '$lib/layouts/ShowDate.svelte';

	const webname:Webname = getContext('webname');
	const pageData = indexFetch(`/rest/tourns/${webname.tournId}/invite`);
	const mySchools = indexFetch(`/user/chapter/byTourn/${webname.tournId}/mySchools`);
	const myChapters = indexFetch(`/user/chapter/byTourn/${webname.tournId}/nonSchools`);

	const makeLink = ( tournId, chapterId ) => {
		const params = `?tourn_id=${tournId}&chapter_id=${chapterId}`;
		return `{import.meta.env.VITE_LEGACY_URL}/user/enter/create.mhtml${params}`;
	};

	/* eslint-disable svelte/no-navigation-without-resolve */

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

					{#each mySchools.data as school (school.id) }
						<h4	class="border-b-2 border-primary-800">
							{school.name} at the {pageData.data.name}
						</h4>

						<div class='w-full flex border-b-1 border-back-400 pt-2'>
							<span class="w-1/3 ps-1">
								<h5>
									Competitor Roster
								</h5>
							</span>

							<span class="w-2/3 flex items-center text-sm italic">
								<span class="w-2/3 text-center">
									{Object.keys(school.entries).length} active entries,
									{ school.students.length} individuals
								</span>
								<span class="w-1/3 text-right pr-4 italic">
									{Object.keys(school.events).length} events
								</span>
							</span>
						</div>

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

						<div class='w-full flex border-b-1 border-back-400 pt-2 items-center'>
							<span class="w-1/3 ps-1">
								<h5>
									Judge Roster
								</h5>
							</span>

							<span class="w-2/3 items-center text-sm text-right pr-4 italic">
								{Object.keys(school.judges).length} judges
							</span>
						</div>

						{#each Object.keys(school.judges) as judgeId (judgeId) }
							{@const judge = school.judges[judgeId]}
							<div class='w-full flex ps-4 py-1 border-b-1 border-back-200'>
								<span class="w-1/5">
									{ judge.first }
								</span>
								<span class="w-1/5">
									{ judge.last }
								</span>
								<span class="w-1/10">
									{ judge.categoryAbbr }
								</span>
								<span class="w-1/4 grow">
									{ judge.code }
								</span>
							</div>
						{/each}

					{/each}
				{/if}

				{#if (myChapters.data.length > 0) }

					<div class="pb-6">
						<h4 class="border-b-2 border-primary-700 pt-4">
							Schools Not Registered in { pageData.data.tourn.name }
						</h4>

						{#each myChapters.data as chapter (chapter.id) }
							<div class='w-full flex border-b-1 border-neutral-200 items-baseline'>
								<span class="w-1/2 grow pl-1">
									<h6>{chapter.name}</h6>
								</span>
								{#if Date(pageData.data.regEnd) > Date() }
									<span class="w-1/4 text-right pe-4">
										Deadline: <ShowDate
													dtString={ pageData.data.tourn.regEnd }
													format='medday'
													/>
									</span>
									<!-- svelte-ignore-file svelte/no-navigation-without-resolve -->
									<span class="w-1/4 text-right pe-4">
										<a class = "text-neutral-100 semibold px-4
												bg-primary-800 radius rounded-sm
												hover:bg-primary-600"
											href  = "{ makeLink( webname.tournId, chapter.id) }"
										>Register</a>
									</span>
								{:else}
									<span class="w-1/2 text-right pe-4 italic">
										Registration Deadline was
										<ShowDate dtISO='{ pageData.data.regEnd }' format='medday'/>
									</span>
								{/if}
							</div>
						{/each}

					</div>
				{/if}

			{/if}
		{/if}

	</div>

