<script lang="ts">

	// This pattern leads to reactive data display in Svelte 5 & TanStack,
	// which is otherwise tricky.
	import { indexFetch } from '$lib/indexfetch';
	import { getContext } from 'svelte';

	const inviteTournId = getContext('inviteTournId');
	let roundList = indexFetch('/public/invite', {key: `${inviteTournId}/rounds`});

</script>

	<div class="main">

		{#if roundList.status === 'pending'}
			<div class='text-success-500 font-semibold'>
				Data Loading...
			</div>
		{:else if roundList.status === 'error'}
			<span>Error: {roundList.error.message}</span>
		{:else}

			{#if roundList.isFetching}
				<div class='text-success-500 font-semibold'>
					Data Updating...
				</div>
			{:else}

				<h5>Published Rounds</h5>
				<h6>Tournament { inviteTournId }</h6>
				{ JSON.stringify(roundList, null, 2) }
			{/if}
		{/if}

	</div>

