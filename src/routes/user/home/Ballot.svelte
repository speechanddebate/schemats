<script lang="ts">
    import type { CurrentBallot } from '$indexcards/schemas';
	import { showTime } from '$lib/helpers/dt';

    const { ballot }: {
        ballot: CurrentBallot
    } = $props();

    const roundTitle = $derived.by(() => {
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
    	if(ballot.flight != null){
    		title += `Flt ${ballot.flight}`;
    	}
    	return title.trim();
    });

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
</script>

<div class="border rounded p-4">
    <div class="flex flex-col lg:flex-row gap-4 pb-1">
        <!-- Info section -->
        <div class="order-1 lg:flex-2">
            <div class="space-y-2">
                <!-- Round -->
                <div class="flex justify-between">
                    <div class="text-sm font-semibold">Round</div>
                    <div class="text-right">{roundTitle}</div>
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
                            	tz: ballot.Tourn.tz,
                            	showTz: true,
                            })}
                    </div>
                </div>
            </div>
        </div>

        <!-- Entries section -->
        <div class="order-2 lg:flex-2 lg:border-l border-t lg:border-t-0 lg:pl-4 pt-4 lg:pt-0">
            <div class="text-sm font-semibold mb-2">Entries</div>
            <div class="space-y-1">
                {#if ballot.Entries}
                    {#each ballot.Entries as entry (entry.id)}
                        <div class="flex gap-2">
                            {#if entry.side}
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

        <!-- Start button -->
        <div class="order-3 lg:flex-2 lg:border-l border-t lg:border-t-0 lg:pl-4 pt-4 lg:pt-0 flex items-center">
            <button class="w-full {startButtonColor} text-white font-semibold py-3 px-4 rounded cursor-pointer">
                {#if ballot.status === 'scored'}
                    CONFIRM RESULT
                {:else if ballot.chair && ballot.Event.type === 'congress' && ballot.audited}
                    SESSION INFO
                {:else if ballot.status === 'started'}
                    ENTER BALLOT
                {:else}
                    {ballot.startText ?? 'START ROUND'}
                {/if}
            </button>
        </div>
    </div>
		{#if ballot.ballotText}
			<div class="text-sm text-center text-gray-500 w-full italic pt-2">{ballot.ballotText}</div>
		{/if}
</div>