<script lang="ts">
	const sampleParadigms = [
		{ id: 1, first: 'Sarah', last: 'Mitchell', school: 'Harvard University', events: 'LD, PF', rounds: 342, rating: 4.8 },
		{ id: 2, first: 'James', last: 'Park', school: 'Georgetown University', events: 'CX, LD', rounds: 287, rating: 4.7 },
		{ id: 3, first: 'Maria', last: 'Gonzalez', school: 'Emory University', events: 'PF', rounds: 215, rating: 4.9 },
		{ id: 4, first: 'David', last: 'Thompson', school: 'Northwestern University', events: 'LD, CX', rounds: 198, rating: 4.6 },
		{ id: 5, first: 'Emily', last: 'Chen', school: 'UC Berkeley', events: 'PF, LD', rounds: 176, rating: 4.5 },
		{ id: 6, first: 'Robert', last: 'Williams', school: 'Wake Forest University', events: 'CX', rounds: 312, rating: 4.8 },
		{ id: 7, first: 'Jennifer', last: 'Davis', school: 'University of Michigan', events: 'Congress, Speech', rounds: 154, rating: 4.4 },
		{ id: 8, first: 'Michael', last: 'Brown', school: 'Stanford University', events: 'Worlds, Parli', rounds: 143, rating: 4.7 },
		{ id: 9, first: 'Lisa', last: 'Anderson', school: 'University of Texas', events: 'LD', rounds: 267, rating: 4.6 },
		{ id: 10, first: 'Christopher', last: 'Lee', school: 'Dartmouth College', events: 'PF, CX', rounds: 189, rating: 4.5 },
	];
</script>

<div class="w-full px-4 ps-8 bg-back-200">
	<div class="main">
		<h3 class="border-b-2 border-primary-600 pb-2 mb-4">Judge Paradigms</h3>

		<p class="text-sm mb-4">
			Search for judge paradigms to learn about judging preferences before your next round.
		</p>

		<div class="mb-4">
			<input
				class="w-full md:w-1/2 p-2 border border-back-400 rounded text-sm"
				placeholder="Search judges by name, school, or event..."
				type="text"
			/>
		</div>

		<div class="border border-back-400 rounded">
			<div class="flex bg-primary-800 text-white px-4 py-2 text-sm font-semibold rounded-t">
				<span class="w-1/4">Judge</span>
				<span class="w-1/4">Affiliation</span>
				<span class="w-1/6 text-center">Events</span>
				<span class="w-1/6 text-center">Rounds Judged</span>
				<span class="w-1/6 text-center">Rating</span>
			</div>
			{#each sampleParadigms as judge (judge.id)}
				<div class="flex items-center border-b border-back-300 px-4 py-2 hover:bg-back-100 cursor-pointer text-sm">
					<span class="w-1/4 font-medium text-primary-800">{judge.first} {judge.last}</span>
					<span class="w-1/4 text-back-700">{judge.school}</span>
					<span class="w-1/6 text-center">{judge.events}</span>
					<span class="w-1/6 text-center">{judge.rounds}</span>
					<span class="w-1/6 text-center">
						<span class="bg-success-100 text-success-800 px-2 py-0.5 rounded text-xs font-semibold">{judge.rating}</span>
					</span>
				</div>
			{/each}
		</div>
	</div>
</div>
