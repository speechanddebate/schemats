<script lang='ts'>

	import Sidebar from '$lib/layouts/Sidebar.svelte';

	let {
		rounds,
		webname,
		currentEvent,
	} = $props();

</script>

	<Sidebar>
		<div class="sidenote">
			<h5 class='my-0 border-b-1 border-secondary-500 pb-0 leading-8 mb-2'>
				Rounds
			</h5>

			<div class='flex flex-wrap'>
				{#each rounds as round (round.roundId)}
					<a
						class = 'blue full bg-back-100 text-sm
							border-s-2 border-primary-400
							border-y-1 border-y-back-300
							hover:bg-secondary-100
							w-1/3
							p-1 mb-1
							{round.eventAbbr === currentEvent ? 'selected' : '' }
						'
						href = {resolve(`/invite/${webname}/rounds/${round.eventAbbr}`, {} )}
					>{round.eventAbbr}</a>

					<a
						class = 'blue full bg-back-100 text-xs
							border-s-2 border-primary-400
							border-y-1 border-y-back-300
							hover:bg-secondary-100
							hidden
						'
						href = {resolve(`/invite/${webname}/round/${round.id}`, {} )}
					>{round.eventAbbr} { round.label || `Round ${round.roundName}`}</a>
				{/each}
			</div>
		</div>
	</Sidebar>