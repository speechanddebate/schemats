<script lang="ts">
	const recentResults = [
		{ id: 1, tournName: 'Greenhill Fall Classic', date: 'Feb 22-23, 2026', location: 'Dallas, TX', events: ['LD', 'PF', 'CX', 'OO', 'DI'] },
		{ id: 2, tournName: 'Harvard National Forensics', date: 'Feb 15-17, 2026', location: 'Cambridge, MA', events: ['LD', 'PF', 'Policy', 'Congress'] },
		{ id: 3, tournName: 'Emory National Debate', date: 'Feb 8-9, 2026', location: 'Atlanta, GA', events: ['LD', 'PF', 'CX'] },
		{ id: 4, tournName: 'Berkeley Invitational', date: 'Feb 1-2, 2026', location: 'Berkeley, CA', events: ['LD', 'PF', 'Parli', 'OO', 'EXT'] },
		{ id: 5, tournName: 'Glenbrooks Speech & Debate', date: 'Jan 25-26, 2026', location: 'Northbrook, IL', events: ['LD', 'PF', 'CX', 'Congress', 'DI', 'HI'] },
		{ id: 6, tournName: 'Yale Invitational', date: 'Jan 18-20, 2026', location: 'New Haven, CT', events: ['LD', 'PF', 'CX', 'Worlds'] },
		{ id: 7, tournName: 'Apple Valley Winter', date: 'Jan 11-12, 2026', location: 'Apple Valley, MN', events: ['LD', 'PF', 'EXT', 'OO'] },
		{ id: 8, tournName: 'Bronx Science Invitational', date: 'Jan 4-5, 2026', location: 'Bronx, NY', events: ['LD', 'PF', 'CX', 'Congress'] },
	];
</script>

<div class="w-full px-4 ps-8 bg-back-200">
	<div class="main">
		<h3 class="border-b-2 border-primary-600 pb-2 mb-4">Recent Tournament Results</h3>

		<p class="text-sm italic text-back-700 mb-4">
			Browse results from recently completed tournaments. Click a tournament to view full results.
		</p>

		<div class="border border-back-400 rounded">
			{#each recentResults as result (result.id)}
				<div class="flex items-center border-b border-back-300 px-4 py-3 hover:bg-back-100 cursor-pointer">
					<div class="w-1/2 grow">
						<h6 class="m-0 text-primary-800">{result.tournName}</h6>
						<span class="text-xs text-back-700">{result.location}</span>
					</div>
					<div class="w-1/4 text-sm text-center">
						{result.date}
					</div>
					<div class="w-1/4 text-right text-xs">
						{result.events.join(', ')}
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
