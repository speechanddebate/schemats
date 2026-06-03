<script lang="ts">
	import { indexFetch } from '$lib/indexfetch';
	import { getContext } from 'svelte';
	import type { Tourn } from '$indexcards/schemas';

	import Sidebar from './sidebar.svelte';
	const tourn:Tourn = getContext('webnameTourn');
	const resultSets = $derived(indexFetch(`/rest/tourns/${tourn.id}/results`));
</script>

	<div class="main">
		{#if resultSets.status === 'pending'}
			<div class='text-success-500 font-semibold'>
				Data Loading...
			</div>
		{:else if resultSets.status === 'error'}
			<span>Error: {resultSets.error.message}</span>
		{:else}

			{#if resultSets.isPending}
				<div class='text-success-500 font-semibold'>
					Data Updating...
				</div>
			{:else}

				<h5>Results Sets</h5>
				<h6>Tournament { tourn.id }</h6>
				<h6>Webname { tourn.webname }</h6>

				<pre>{ JSON.stringify(resultSets.data, null, 2) }</pre>
			{/if}
		{/if}

	</div>

	<Sidebar />