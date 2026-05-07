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
			{:else}

				<h5>Published Rounds</h5>
				<h6>Tournament { tourn.id }</h6>
				<h6>Webname { tourn.webname }</h6>
				{roundList.status}

				<pre>{ JSON.stringify(roundList.data, null, 2) }</pre>

			{/if}
		{/if}
	</div>

	<Sidebar />
