<script lang="ts">
	import { indexFetch } from '$lib/indexfetch';
	import { getContext } from 'svelte';
	import Sidebar from './sidebar.svelte';

	import type { Tourn } from '$indexcards/schemas';
	const tourn:Tourn = getContext('webnameTourn');
	let roundList = $derived(indexFetch(`/rest/tourns/${tourn.id}/rounds`));

</script>

	<div class="main">
		{#if roundList.status === 'pending'}
			<div class='text-success-500 font-semibold'>
				Data Loading...
			</div>
		{:else if roundList.status === 'error'}
			<span>Error: {roundList.error.message}</span>
		{:else}

			{#if roundList.isPending}
				<div class='text-success-500 font-semibold'>
					Data Updating...
				</div>

			{:else if roundList.data.length < 1}

				<h5>No Published Rounds</h5>

				<p>This tournament has not yet published rounds.</p>

			{:else}
				<h5>Published Rounds</h5>
			{/if}
		{/if}
	</div>

	<Sidebar />
