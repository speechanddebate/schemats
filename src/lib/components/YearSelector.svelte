<script lang="ts">
    import { SvelteDate } from 'svelte/reactivity';
	import { CaretLeftSolid, CaretRightSolid } from 'flowbite-svelte-icons';

type Props = {
	startDate: Date,
	endDate: Date,
}

let {startDate = $bindable(), endDate = $bindable()}: Props = $props();

let startYear = $derived(startDate.getFullYear());
let endYear = $derived(endDate.getFullYear());

function shiftYears(delta: number) {
	const newStart = new SvelteDate(startDate);
	newStart.setFullYear(newStart.getFullYear() + delta);

	const newEnd = new SvelteDate(endDate);
	newEnd.setFullYear(newEnd.getFullYear() + delta);

	startDate = newStart;
	endDate = newEnd;
}
</script>

<div class="flex justify-center gap-4">
	<button class="cursor-pointer"
	aria-label="Previous year"
	onclick={() => shiftYears(-1)}><CaretLeftSolid size="xl"/></button>
	<p class="font-light text-5xl">{startYear}-{endYear}</p>
  <button class="cursor-pointer"
  aria-label="Next year"
  onclick={() => shiftYears(1)}><CaretRightSolid size="xl"/></button>
</div>

<style>

</style>