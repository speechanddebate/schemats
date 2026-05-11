<script lang="ts">
/**
 *  a dropdown to select a school year, which is then used to filter results on the page.
 *  The value is a string in the format "YYYY-YYYY", representing the start and end years of the school year.
*/
	import { SvelteDate } from 'svelte/reactivity';

	type Props = {
		value?: string,
		oldestYear?: number,
	};

	const now = new SvelteDate();
	const currentSchoolYearStart =
		now.getMonth() >= 6 ? now.getFullYear() : now.getFullYear() - 1;

	let {
		value = $bindable(`${currentSchoolYearStart}-${currentSchoolYearStart + 1}`),
		oldestYear = 2011,
	}: Props = $props();

	const schoolYearStarts = $derived.by(() => {
		return Array.from(
			{ length: currentSchoolYearStart - oldestYear + 1 },
			(_, index) => currentSchoolYearStart - index,
		);
	});

	const onChange = (event: Event) => {
		const target = event.currentTarget as HTMLSelectElement;
		value = target.value;
	};
</script>

<div class="w-full">
	<label class='text-xs font-semibold' for='schoolYearStart'>
		Select school-year start
	</label>
	<select
		id='schoolYearStart'
		class='mt-1 w-full rounded border border-back-400 bg-back px-2 py-1 text-sm'
		onchange={onChange}
		value={value}
	>
		{#each schoolYearStarts as startYear (startYear)}
			<option value={`${startYear}-${startYear + 1}`}>
				{startYear}-{startYear + 1}
			</option>
		{/each}
	</select>
</div>
