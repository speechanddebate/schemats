<script lang="ts">
    import type { CurrentBallot } from '$indexcards/schemas';

	const { ballot }: {
		ballot: CurrentBallot
	} = $props();

	const roundTitle =$derived.by(() => {
		let title = '';
		if(ballot.Event.type !== 'mock_trial') {
			title += ballot.Event.abbr + ' ';
		}
		if(ballot.Round.label){
			title += ballot.Round.label + ' ';
		} else if(ballot.Event.type === 'congress') {
			title += `Session ${ballot.Round.name}`;
		} else {
			title += `Round ${ballot.Round.name} `;
		}
		if(ballot.Round.flighted){
			title += `Flt ${ballot.flight}`;
		}
		return title.trim();
	});
</script>

<div class="border-2 rounded-md border-primary-600 w-full p-2">
	<span class="font-semibold">{roundTitle}</span>
</div>