<script lang="ts">
	const tournStats = {
		tournamentsThisSeason: 12,
		roundsJudged: 47,
		studentsCoached: 18,
		schoolsManaged: 1,
	};

	const recentTournaments = [
		{ id: 1, name: 'Winter Invitational', date: 'Feb 22-23, 2026', role: 'Coach', result: '2 finalists, 1 champion' },
		{ id: 2, name: 'MLK Debate Classic', date: 'Jan 18-19, 2026', role: 'Judge', result: '12 rounds judged' },
		{ id: 3, name: 'New Year Kickoff', date: 'Jan 4-5, 2026', role: 'Coach', result: '3 entries advanced to elims' },
		{ id: 4, name: 'Fall Championship', date: 'Nov 15-16, 2025', role: 'Coach & Judge', result: '1 semifinalist, 8 rounds judged' },
	];
</script>

<h4 class="border-b-2 border-primary-600 pb-2 mb-4">Dashboard</h4>

<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
	<div class="border border-back-400 rounded p-4 text-center">
		<div class="text-3xl font-bold text-primary-700">{tournStats.tournamentsThisSeason}</div>
		<div class="text-xs text-back-700 mt-1">Tournaments</div>
	</div>
	<div class="border border-back-400 rounded p-4 text-center">
		<div class="text-3xl font-bold text-primary-700">{tournStats.roundsJudged}</div>
		<div class="text-xs text-back-700 mt-1">Rounds Judged</div>
	</div>
	<div class="border border-back-400 rounded p-4 text-center">
		<div class="text-3xl font-bold text-primary-700">{tournStats.studentsCoached}</div>
		<div class="text-xs text-back-700 mt-1">Students</div>
	</div>
	<div class="border border-back-400 rounded p-4 text-center">
		<div class="text-3xl font-bold text-primary-700">{tournStats.schoolsManaged}</div>
		<div class="text-xs text-back-700 mt-1">Schools</div>
	</div>
</div>

<h5 class="mb-2">Recent Tournaments</h5>

{#each recentTournaments as tourn (tourn.id)}
	<div class="flex items-center border-b border-back-300 py-3 px-2 hover:bg-back-100">
		<div class="w-1/3">
			<h6 class="m-0 text-primary-800">{tourn.name}</h6>
			<span class="text-xs text-back-700">{tourn.date}</span>
		</div>
		<div class="w-1/6 text-center">
			<span class="text-xs bg-primary-100 text-primary-800 px-2 py-0.5 rounded">{tourn.role}</span>
		</div>
		<div class="w-1/2 text-sm text-right text-back-700">
			{tourn.result}
		</div>
	</div>
{/each}
