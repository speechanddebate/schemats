<script lang="ts">
	import { createRestTourns } from '$indexcards';
	import SchoolYearSelector from '$lib/components/forms/schoolYearSelector.svelte';
	import TournResults from '$lib/components/tables/tournResults.svelte';
	import { safeExtract } from '$lib/helpers/query';
	import Sidebar from '$lib/layouts/Sidebar.svelte';
	import { SvelteDate } from 'svelte/reactivity';

	const now = new SvelteDate();
	const currentSchoolYearStart =
		now.getMonth() >= 6 ? now.getFullYear() : now.getFullYear() - 1;

	let schoolYearValue = $state(`${currentSchoolYearStart}-${currentSchoolYearStart + 1}`);

	// Derive the start and end dates of the selected school year
	const schoolYearStart = $derived.by(() => {
		const match = schoolYearValue.match(/^(\d{4})-(\d{4})$/);
		const startYear = match ? Number(match[1]) : currentSchoolYearStart;
		return new Date(startYear, 6, 1, 0, 0, 0, 0);
	});
	const schoolYearEnd = $derived.by(() => {
		const match = schoolYearValue.match(/^(\d{4})-(\d{4})$/);
		const startYear = match ? Number(match[1]) : currentSchoolYearStart;
		return new Date(startYear + 1, 5, 30, 23, 59, 59, 999);
	});

	const tournsQuery = createRestTourns(() => ({
		limit: 256,
		offset: 0,
		publishedResults: true,
		startAfter: schoolYearStart.toISOString(),
		startBefore: schoolYearEnd.toISOString(),
	}));

	const tournsData = $derived(safeExtract(tournsQuery));

</script>
<div class="flex w-full flex-col lg:flex-row">
	<div class="main">
		<TournResults data={tournsData} />
	</div>

	<Sidebar>
		<div class="sidenote">
			<h5 class='my-0 border-b border-secondary-500 pb-0 leading-8 mb-2'>
				School Year
			</h5>

			<SchoolYearSelector
				oldestYear={2011}
				bind:value={schoolYearValue}
			/>

			<p class='mt-2 mb-0 text-xs leading-4'>
				Showing results from Jul 1, {schoolYearStart.getFullYear()}
				through Jun 30, {schoolYearEnd.getFullYear()} ({schoolYearValue}).
			</p>
		</div>
	</Sidebar>
</div>