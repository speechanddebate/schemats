<script lang="ts">
	import { indexFetch } from '$lib/indexfetch';
	import { getContext } from 'svelte';

	import type { Tourn } from '$indexcards/schemas';
	const tourn:Tourn = getContext('webnameTourn');
	const publishedData = $derived(indexFetch(`/pages/invite/${tourn.id}`));
</script>

	<div class="main">
		{#if publishedData.status === 'pending'}
			<div class='text-success-500 font-semibold'>
				Data Loading...
			</div>
		{:else if publishedData.status === 'error'}
			<span>Error: {publishedData.error.message}</span>
		{:else}

			{#if publishedData.isPending}
				<div class='text-success-500 font-semibold'>
					Data Updating...
				</div>
			{:else}

				<h5>Published Invite</h5>
				<h6>Tournament { tourn.id }</h6>
				<h6>Webname { tourn.webname }</h6>

				<pre>{ JSON.stringify(publishedData.data, null, 2) }</pre>
			{/if}
		{/if}

	</div>

