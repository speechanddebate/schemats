<script lang="ts">
    import { shortZone } from '$lib/helpers/dt';
	import ShowDate from '$lib/layouts/ShowDate.svelte';
	import { ucfirst } from '$lib/helpers/text';

	interface RoundTime {
		start     : string,
		deadline? : string,
		tz        : Array<string>,
	}

	interface RoundTimes {
		[key: number] : RoundTime;
	};

	let {times, tournTz} : {tournTz?: string, times:RoundTimes} = $props();

	const flights = $derived(
		Object.keys(times).map(Number).sort((a, b) => a - b)
	);

	const numFlights = $derived(flights.length);

	const tags = {
		start    : 'primary-600',
		deadline : 'warning-600',
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
						text-{tags[key]} flex border-b-1 border-{tags[key]}
					'>
						<span class="w-1/4">
							{ ucfirst(key) }:
						</span>
						<span class="w-1/4 text-right pe-0.5 text-black">
							<ShowDate
								dtISO  = {times[1][key]}
								format = 'fullDayOnly'
								mode   = 'date'
								tz     = {tournTz || 'UTC'}
							/>
						</span>
						<span class="w-1/2 grow ps-0.5 text-black">
							at
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
					{#if numFlights > 1}
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
					{:else}
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
					{/if}
				</div>
			{/if}
		{/each}
	{/if}