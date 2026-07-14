<script lang="ts">
	import { createGetTournResultSets } from '$indexcards';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
	//const tourn:Tourn = getContext('webnameTourn');
	const resultsQuery = createGetTournResultSets(() => data.tourn.id);
</script>

	<div class="main">
		{#if resultsQuery.status === 'pending'}
			<div class='text-success-500 font-semibold'>
				Data Loading...
			</div>
		{:else if resultsQuery.status === 'error'}
			<span>Error: {resultsQuery.error.message}</span>
		{:else}

			{#if resultsQuery.isFetching}
				<div class='text-success-500 font-semibold'>
					Data Updating...
				</div>
			{:else}
				<h5>Results Tables</h5>
			{/if}
		{/if}
	</div>