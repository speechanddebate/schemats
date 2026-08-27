<script lang="ts">
    import type { CurrentBallot } from '$indexcards/schemas';
	import { showTime } from '$lib/helpers/dt';

    const { ballot }: {
        ballot: CurrentBallot
    } = $props();

	const startButtonColor = $derived.by(() => {
		switch(ballot.status) {
			case 'not_started':
				return 'bg-success-600';
			case 'scored':
				return 'bg-red-600';
			default:
				return 'bg-primary-600';
		}
	});

	function getLabel(b: CurrentBallot) {
		let label = '';
		if (b.label){
			label = b.label;
		}
		else if (b.eventType === 'congress'){
			label = `Session ${b.name}`;
		}
		else {
			label = `Round ${b.name}`;
		}
		if (b.flight){
			label += ` Flt ${b.flight}`;
		}
		return label.trim();
	}

</script>

<div class="border rounded p-4">
    <div class="flex flex-col lg:flex-row gap-4 pb-1">
        <!-- Info section -->
        <div class="order-1 lg:flex-2">
            <div class="space-y-2">
                <!-- Round -->
                <div class="flex justify-between">
                    <div class="text-sm font-semibold">Round</div>
                    <div class="text-right">{getLabel(ballot)}</div>
                </div>

                <!-- Room -->
                <div class="flex justify-between">
                    <div class="text-sm font-semibold">Room</div>
                    <div class="text-right">
                        {#if ballot.roomName}
                            { ballot.roomName }
                        {:else}
                            <span class="text-gray-400 italic">{ballot.roomName}</span>
                        {/if}
                    </div>
                </div>

                <!-- Time -->
                <div class="flex justify-between">
                    <div class="text-sm font-semibold">Time</div>
                    <div class="text-right">
						{showTime({
							dtISO: ballot.start,
							format: 'short',
							tz: ballot.TournTz,
							showTz: true,
						})}
                    </div>
                </div>
            </div>
        </div>

        <!-- Entries section -->
		{#if ballot.eventType !== 'congress' && !ballot.legion}
			<div class="order-2 lg:flex-2 lg:border-l border-t lg:border-t-0 lg:pl-4 pt-4 lg:pt-0">
				<div class="text-sm font-semibold mb-2">Entries
				{#if ballot.flipStatus && ballot.flipStatus !== 'done'}i
						<span class="text-sm text-gray-500 italic">Flip for sides not complete</span>
				{/if}
				</div>
				<div>
					{#if ballot.Entries}
						{#each ballot.Entries as entry (entry.id)}
							<div class="flex gap-1">
								{#if ballot.eventType === 'speech'}
									<span class="font-semibold">{entry.speakerOrder}</span>
									<span>{entry.code}</span>
								{:else if entry.side}
									<span class="font-semibold">{entry.side}</span>
									<span>{entry.code}</span>
								{:else}
									<span>{entry.code}</span>
								{/if}
							</div>
						{/each}
					{:else}
						<div class="text-sm text-gray-500 italic">No entries assigned</div>
					{/if}
				</div>
			</div>
		{/if}

    </div>
        <!-- Start button -->
		{#if ballot.onlineBallots}
			<div class="pt-4 lg:pt-0 flex flex-col  gap-1 items-center">
				{#if (ballot.eventType === 'wudc' && !ballot.chair)}
					<div class="w-full text-primary-600 font-semibold p-2 text-center
							border border-primary-600 rounded-md rounded">
						Panelist Judge<br/>(Only chairs enter ballots)
					</div>
				{:else}
					<a class="w-full {startButtonColor} text-center text-white font-semibold py-3 px-4 rounded cursor-pointer"
						href="https://tabroom.com/user/judge/{ballot.legion ? 'legion_' : ''}ballot.mhtml?panel_id=${ballot.id}&judge_id=${ballot.JudgeId}$">
						{#if ballot.status === 'scored'}
								CONFIRM RESULT
						{:else if ballot.chair && ballot.eventType === 'congress' && ballot.audited}
								SESSION INFO
						{:else if ballot.status === 'started'}
								ENTER BALLOT
						{:else}
								{ballot.startText ?? 'START ROUND'}
						{/if}
					</a>
				{/if}
				{#if (ballot.legion)}
				<a
					class="w-full text-primary-600 text-center font-semibold py-3 px-4 rounded cursor-pointer
						border border-primary-600 rounded-md"
					href="https://tabroom.com/user/judge/legion_comments.mhtml?panel_id=${ballot.id}&judge_id=${ballot.JudgeId}">
					Feedback
				</a>
				{/if}
			</div>
		{/if}
		{#if ballot.ballotText}
			<div class="text-sm text-center text-gray-500 w-full italic pt-2">{ballot.ballotText}</div>
		{/if}
</div>