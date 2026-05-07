<script lang="ts">
	import { createRestParadigm, createRestParadigmsRecord } from '$indexcards';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import ParadigmDetails from '$lib/components/paradigms/paradigmDetails.svelte';
    import { safeExtract } from '$lib/helpers/query';

	const personId = $derived(Number(page.params.id));

	const paradigmDetailsQuery = createRestParadigm(
		() => personId,
		() => ({
			query: {
				enabled: Number.isInteger(personId) && personId > 0,
			},
		}),
	);

	const paradigmDetailsData = $derived.by(() => {
		if (!paradigmDetailsQuery.data) return null;
		if (paradigmDetailsQuery.data.status === 200) {
			return paradigmDetailsQuery.data.data || null;
		}
		return null;
	});

	const judgeRecordQuery = createRestParadigmsRecord(
		() => personId,
		() => ({
			query: {
				enabled: Number.isInteger(personId) && personId > 0,
			},
		}),
	);

	const judgeRecord = $derived(safeExtract(judgeRecordQuery));

	function backToResults() {
		const search = page.url.searchParams.get('search')?.trim();
		if (search) {
			goto(`/paradigms?search=${encodeURIComponent(search)}`);
			return;
		}

		goto('/paradigms');
	}
</script>

<svelte:head>
	<title>Paradigms{paradigmDetailsData?.name ? ` - ${paradigmDetailsData.name}` : ''}</title>
</svelte:head>

<div class='flex flex-wrap min-h-[80vh] override px-4'>
	<div class='w-full pl-4 py-2'>
		<h2>
			Judge Paradigms
		</h2>
	</div>
	<div class="main">
		<div class="min-h-screen max-w-7xl p-2 xs:p-4 m-auto">
			<div class="mx-auto max-w-7xl mt-4 px-4">
				<ParadigmDetails
					backFunction ={backToResults}
					data         ={paradigmDetailsData}
					displayBack  ={true}
					isLoading    ={paradigmDetailsQuery.isLoading}
					record       ={judgeRecord}
				/>
			</div>
		</div>
	</div>
</div>
