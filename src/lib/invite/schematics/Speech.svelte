<script lang="ts">

	let {roundData}  = $props();
	import Gavel from '$lib/layouts/Gavel.svelte';

	// SORT THAT ARRAY
	const sections = $derived.by( () => {
		const sectionKeys = Object.keys(roundData.Sections)
			// Thou may blowest it out thine ass, Typescript
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.sort( (a:any,b:any) => {
				const aS = roundData.Sections[a];
				const bS = roundData.Sections[b];
				if (aS.me > bS.me) return 2;
				if (bS.me > aS.me) return -2;
				if (aS.letter.localeCompare(bS.letter)) return 1;
				if (bS.letter.localeCompare(aS.letter)) return -1;
				return 0;
			});

		return sectionKeys.map( (key) => {
			return roundData.Sections[key];
		});
	});

</script>

<div class="flex flex-wrap w-full justify-around m-0 p-0">

	{#each sections as section (section.id)}
		<span class="
			w-[180px]
			mx-1 mt-2
			bg-neutral-100
			border-1
			border-primary-600
			text-sm
			flex flex-col
			justify-between
		">

			<div>
				<div class="w-full border-primary-600 border-b-2 text-center">
					<div class="font-semibold pt-1">
						{roundData.Event.type == 'congress' ? 'Chamber' : 'Section'}
						{section.letter}
					</div>

					{#if section.roomName}
						<div class="font-semibold text-xs">
							in {section.roomName}
						</div>
						{#if section.roomNotes}
							<div class="italic text-center text-xs">
								in {section.roomNotes}
							</div>
						{/if}
					{/if}
				</div>

				<div class='text-xs px-1 mt-1 pt-1'>
					{#each Object
						.keys(section.entries)
						.sort((a,b) =>  parseInt(a) - parseInt(b)) as speaker (speaker)
					}
						<div
							class='w-full flex py-[4px] border-b-1'
							title='{ section.entries[speaker].code }'
						>
							<span class="w-1/6 ps-[2px] leading-3">
								{ speaker }
							</span>
							<span class="w-5/6 leading-3 pe-[2px]">
								{ section.entries[speaker].code }
							</span>
						</div>
					{/each}
				</div>
			</div>

			<div class='text-xs border-t-2 border-primary-600
				px-1 mt-1 pt-1 pb-2
			'>
				{#each Object
					.keys(section.judges)
					.sort((a,b) => {
						if (section.judges[a].chair) return -1;
						if (section.judges[b].chair) return 1;
						return section.judges[a].last.localeCompare(section.judges[b]);
					}) as judgeId (judgeId)
				}
					<div class='w-full flex justify-around text-xs'>
						{#if section.judges[judgeId].chair}
							<div class='flex font-semibold text-xs'>
								<span class="pe-[2px] text-primary-600">
									<Gavel />
								</span>
								{ section.judges[judgeId].code }
								{ section.judges[judgeId].first }
								{ section.judges[judgeId].last }
							</div>
						{:else}
							{ section.judges[judgeId].code }
							{ section.judges[judgeId].first }
							{ section.judges[judgeId].last }
						{/if}
					</div>
				{/each}
			</div>

		</span>

	{/each}

</div>