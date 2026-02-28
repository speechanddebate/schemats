<script lang="ts">

	let {myTourn, roundData}  = $props();
	import Gavel from '$lib/layouts/Gavel.svelte';
	import { intersection } from '$lib/helpers/text';

	// SORT THAT ARRAY
	const sections = $derived.by( () => {
		const sectionKeys = Object.keys(roundData.Sections);

		return sectionKeys.map( (key) => {

			['me', 'mine'].forEach( (owner) => {
				roundData.Sections[key][owner] = 0;
				if (intersection(
					myTourn[owner].entries,
					roundData.Sections[key].entryIds
				).length) roundData.Sections[key][owner] = 1;
				if (!roundData.Sections[key][owner]) {
					if (intersection(
						myTourn[owner].judges,
						roundData.Sections[key].judgeIds
					).length) roundData.Sections[key][owner] = 1;
				}
			});

			return roundData.Sections[key];

		// Thou may blowest it out thine ass, Typescript
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		}).sort( (a:any,b:any) => {
			if (a.me || b.me) return (a.me == b.me)? 0 : a.me? -1 : 1;
			if (a.mine || b.mine) return (a.mine == b.mine)? 0 : a.mine? -1 : 1;
			if (a.letter.localeCompare(b.letter)) return 1;
			if (b.letter.localeCompare(a.letter)) return -1;
			return 0;
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
					<div class="font-semibold pt-1 {
						section.me
							? 'text-warning-500'
							: section.mine ? 'text-success-500' : ''
					} ">
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
						.keys(section.Entries)
						.sort((a,b) =>  parseInt(a) - parseInt(b)) as speaker (speaker)
					}
						<div
							class='w-full flex py-[4px] border-b-1'
							title='{ section.Entries[speaker].code }'
						>
							<span class="w-1/6 ps-[2px] leading-3">
								{ speaker }
							</span>
							<span
								class='w-5/6 leading-3 pe-[2px] {
									myTourn.me.entries.includes(section.Entries[speaker].id)
									? 'font-semibold underline decoration-warning-400'
									: ''
								} {
									myTourn.mine.entries.includes(section.Entries[speaker].id)
									? 'font-semibold underline decoration-success-500 text-success-500'
									: ''
								}'
							>
								{ section.Entries[speaker].code }
							</span>
						</div>
					{/each}
				</div>
			</div>

			<div class='text-xs border-t-2 border-primary-600
				px-1 mt-1 pt-1 pb-2
			'>
				{#each section.judgeIds
					.sort((a:number,b:number) => {
						if (section.Judges[a].chair) return -1;
						if (section.Judges[b].chair) return 1;
						return section.Judges[a].last.localeCompare(section.Judges[b]);
					}) as judgeId (judgeId)
				}
					<div class='w-full flex justify-around text-xs overflow-x-hidden whitespace-nowrap {
						myTourn.me.judges.includes(judgeId)
							? 'text-warning-500 font-semibold'
							:  myTourn.mine.judges.includes(judgeId)
								? 'text-success-500 font-semibold'
								: 'text-black-600'
					} '>
						{#if section.Judges[judgeId].chair}
							<div class='flex font-semibold text-xs'>
								<span class="pe-[2px] border">
									<Gavel />
								</span>
								{ section.Judges[judgeId].code }
								{ section.Judges[judgeId].first }
								{ section.Judges[judgeId].last }
							</div>
						{:else}
							{ section.Judges[judgeId].code }
							{ section.Judges[judgeId].first }
							{ section.Judges[judgeId].last }
						{/if}
					</div>
				{/each}
			</div>
		</span>
	{/each}
</div>