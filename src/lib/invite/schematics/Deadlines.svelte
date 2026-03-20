<script lang="ts">
    import { shortZone } from '$lib/helpers/dt';
	import ShowDate from '$lib/layouts/ShowDate.svelte';
	import { ucfirst } from '$lib/helpers/text';

	interface RoundTime {
		start     : string,
		deadline? : string,
		draw?     : string,
		tz        : Array<string>,
	}

	interface RoundTimes {
		[key: number] : RoundTime;
	};

	let {times, tournTz} : {tournTz?: string, times:RoundTimes} = $props();

	const flights = $derived.by( () => {
		if (times) return Object.keys(times).map(Number).sort((a, b) => a - b);
		return [];
	});

	const numFlights = $derived(flights.length);

	const tags = {
		draw           : 'warning-500',
		start          : 'primary-600',
		deadline       : 'warning-500',
	};

	const timeLabels = {
		draw     : 'Draw Starts',
		deadline : 'Voting Deadline',
		start    : 'Round Begins',
	};

	const keys = Object.keys(tags) as (keyof typeof tags)[];

</script>

	<!-- seems odd but this is by far the most common use case and doesn't
	require all that other mess-->

	{#if (numFlights == 1 && (times[1].tz.length == 1))}
		<div class="w-full mt-1">
			{#each keys as key (key)}
				{#if times[1][key]}
					<div class='font-semibold
						mb-0.5 pb-0.5
						text-md
						text-{tags[key]} flex border-b border-b-neutral-400 border-{tags[key]}
					'>
						<span class="grow w-2/5 italic">
							{ timeLabels[key] || ucfirst(key) }
						</span>
						<span class="text-right pe-0.5 text-black">
							<ShowDate
								dtISO  = {times[1][key]}
								format = 'fullDayOnly'
								mode   = 'date'
								tz     = {tournTz || 'UTC'}
							/>
						</span>
						<span class="text-black text-right ps-3">
							<ShowDate
								dtISO  = {times[1][key]}
								mode   = 'time'
								showTz = {true}
								tz     = {tournTz}
							/>
						</span>
					</div>
				{/if}
			{/each}
		</div>
	{:else}

		{#if numFlights > 1}
			<div class='w-full flex flex-wrap justify-end'>
				{#each keys as key (key)}
					{#if times[1][key] }
						<div class="w-1/2 mt-1 pe-2 ">
							<div class='font-semibold
								mb-0.5 pb-0.5 text-sm
								text-{tags[key]} flex border-b border-{tags[key]}
							'>
								<span class="w-1/2 m-0 p-0 leading-4">
									{ucfirst(key)}
								</span>
								{#each times[1].tz as tz (tz) }
									<span class="w-1/4 grow pe-1 text-xs content-end leading-4 text-center">
										{ shortZone(tz) }
									</span>
								{/each}
							</div>
							{#each flights as flight (flight)}
								<div class='flex text-xs'>
									<span class="w-1/4">
										Flight {flight}
									</span>
									<span class="w-1/4 text-center">
										<ShowDate
											dtISO  = {times[flight][key]}
											format = 'dayOnly'
											mode   = 'date'
											tz     = {tournTz || 'UTC'}
										/>
									</span>
									{#each times[flight].tz as tz (tz) }
										<span class="w-1/4 grow text-center pe-0.5">
											<ShowDate
												dtISO  = {times[flight][key]}
												mode   = 'time'
												{tz}
											/>
										</span>
									{/each}
								</div>
							{/each}
						</div>
					{/if}
				{/each}
			</div>
		{:else}
			{#each keys as key (key)}
				{#if times[1][key] }
					<div class="w-full mt-1">
						<div class='font-semibold
							mb-0.5 pb-0.5 text-sm
							text-{tags[key]} flex border-b-1 border-{tags[key]}
						'>
							<span class="w-1/2 m-0 p-0 leading-4">
								{ucfirst(key)}
							</span>
							{#each times[1].tz as tz (tz) }
								<span class="w-1/4 grow pe-1 text-xs content-end leading-4 text-center">
									{ shortZone(tz) }
								</span>
							{/each}
						</div>
						<div class='flex text-xs'>
							<span class="w-1/2 ps-1">
								<ShowDate
									dtISO  = {times[1][key]}
									format = 'dayOnly'
									mode   = 'date'
									tz     = {tournTz || 'UTC'}
								/>
							</span>
							{#each times[1].tz as tz (tz) }
								<span class="w-1/4 grow text-center pe-0.5">
									<ShowDate
										dtISO  = {times[1][key]}
										mode   = 'time'
										{tz}
									/>
								</span>
							{/each}
						</div>
					</div>
				{/if}
			{/each}
		{/if}
	{/if}