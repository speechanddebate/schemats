<script lang="ts">
	const ballots = [
		{ id: 1, tourn: 'Winter Invitational', event: 'LD', round: 'Round 3', date: 'Feb 23, 2026', aff: 'Chen & Liu', neg: 'Park & Kim', decision: 'Aff', submitted: true },
		{ id: 2, tourn: 'Winter Invitational', event: 'LD', round: 'Round 2', date: 'Feb 22, 2026', aff: 'Davis', neg: 'Williams', decision: 'Neg', submitted: true },
		{ id: 3, tourn: 'Winter Invitational', event: 'LD', round: 'Round 1', date: 'Feb 22, 2026', aff: 'Thompson', neg: 'Garcia', decision: 'Aff', submitted: true },
		{ id: 4, tourn: 'MLK Debate Classic', event: 'PF', round: 'Finals', date: 'Jan 19, 2026', aff: 'Lin & Patel', neg: 'Roberts & Jones', decision: 'Neg', submitted: true },
		{ id: 5, tourn: 'MLK Debate Classic', event: 'PF', round: 'Semis', date: 'Jan 19, 2026', aff: 'Brown & Taylor', neg: 'Lin & Patel', decision: 'Neg', submitted: true },
		{ id: 6, tourn: 'MLK Debate Classic', event: 'PF', round: 'Round 4', date: 'Jan 19, 2026', aff: 'Smith & Lee', neg: 'Johnson & White', decision: 'Aff', submitted: true },
	];

	const pendingBallots = [
		{ id: 7, tourn: 'State Qualifier', event: 'LD', round: 'Round 1', date: 'Upcoming', submitted: false },
	];
</script>

<h4 class="border-b-2 border-primary-600 pb-2 mb-4">My Ballots</h4>

{#if pendingBallots.length > 0}
	<div class="bg-warning-100 border border-warning-400 rounded p-3 mb-4">
		<h6 class="m-0 text-warning-800">Pending Ballots</h6>
		{#each pendingBallots as ballot (ballot.id)}
			<div class="text-sm mt-1">
				{ballot.tourn} &mdash; {ballot.event} {ballot.round}
				<span class="text-xs italic text-warning-700">(awaiting assignment)</span>
			</div>
		{/each}
	</div>
{/if}

<h5 class="mb-2">Completed Ballots</h5>

<div class="border border-back-400 rounded">
	<div class="flex bg-primary-800 text-white px-4 py-2 text-xs font-semibold rounded-t">
		<span class="w-1/5">Tournament</span>
		<span class="w-[60px] text-center">Event</span>
		<span class="w-1/6">Round</span>
		<span class="w-1/5">Aff</span>
		<span class="w-1/5">Neg</span>
		<span class="w-[80px] text-center">Decision</span>
	</div>
	{#each ballots as ballot (ballot.id)}
		<div class="flex items-center border-b border-back-300 px-4 py-2 hover:bg-back-100 text-sm">
			<span class="w-1/5 text-xs">{ballot.tourn}</span>
			<span class="w-[60px] text-center text-xs">{ballot.event}</span>
			<span class="w-1/6 text-xs">{ballot.round}</span>
			<span class="w-1/5 {ballot.decision === 'Aff' ? 'font-semibold text-success-700' : ''}">{ballot.aff}</span>
			<span class="w-1/5 {ballot.decision === 'Neg' ? 'font-semibold text-success-700' : ''}">{ballot.neg}</span>
			<span class="w-[80px] text-center">
				<span class="text-xs px-2 py-0.5 rounded {ballot.decision === 'Aff' ? 'bg-success-100 text-success-800' : 'bg-primary-100 text-primary-800'}">{ballot.decision}</span>
			</span>
		</div>
	{/each}
</div>
