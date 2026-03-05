<script lang="ts">
	import { indexFetch } from '$lib/indexfetch';

	const sessionData = indexFetch('/user/session');

	const upcomingTourns = [
		{ id: 1, name: 'Demo Championship Tournament', date: 'Apr 10-12, 2026', role: 'Coach', school: 'Lincoln High School', entries: 3, judges: 2 },
		{ id: 2, name: 'State Qualifier', date: 'Apr 25-26, 2026', role: 'Judge', school: null, entries: 0, judges: 0 },
		{ id: 3, name: 'District Tournament', date: 'May 3-4, 2026', role: 'Coach', school: 'Lincoln High School', entries: 5, judges: 3 },
	];
</script>

<h4 class="border-b-2 border-primary-600 pb-2 mb-4">
	Welcome, {sessionData.data?.Person?.first || 'User'}
</h4>

<h5 class="mb-2">Your Upcoming Tournaments</h5>

{#each upcomingTourns as tourn (tourn.id)}
	<div class="flex items-center border-b border-back-300 py-3 px-2 hover:bg-back-100">
		<div class="w-1/3 grow">
			<h6 class="m-0 text-primary-800">{tourn.name}</h6>
			<span class="text-xs text-back-700">{tourn.date}</span>
		</div>
		<div class="w-1/6 text-center">
			<span class="text-xs bg-primary-100 text-primary-800 px-2 py-0.5 rounded">{tourn.role}</span>
		</div>
		<div class="w-1/4 text-sm text-right">
			{#if tourn.school}
				{tourn.school} &mdash; {tourn.entries} entries, {tourn.judges} judges
			{/if}
		</div>
	</div>
{/each}

<h5 class="mt-6 mb-2">Recent Activity</h5>
<div class="text-sm">
	<div class="border-b border-back-200 py-2 px-2">Registration confirmed for Demo Championship Tournament</div>
	<div class="border-b border-back-200 py-2 px-2">Judge assignment updated for State Qualifier</div>
	<div class="border-b border-back-200 py-2 px-2">New message from tournament director</div>
	<div class="border-b border-back-200 py-2 px-2">Results posted for Winter Invitational</div>
</div>
