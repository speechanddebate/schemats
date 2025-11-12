<script lang="ts">

	// This pattern leads to reactive data display in Svelte 5 & TanStack,
	// which is otherwise tricky.
	import { indexFetch } from '$lib/indexfetch';
	import { getContext } from 'svelte';
	import type { Webname } from '../inviteTypes';

	const webname:Webname = getContext('webname');
	const publishedData = indexFetch('/public/invite', {key: `${webname.tournId}`});

</script>

	<div class="main">
		{#if publishedData.status === 'pending'}
			<div class='text-success-500 font-semibold'>
				Data Loading...
			</div>
		{:else if publishedData.status === 'error'}
			<span>Error: {publishedData.error.message}</span>
		{:else}

			{#if publishedData.isFetching}
				<div class='text-success-500 font-semibold'>
					Data Updating...
				</div>
			{:else}

				<h5>Published Invite</h5>
				<h6>Tournament { webname.tournId }</h6>
				<h6>Webname { webname.webname }</h6>

				<pre>{ JSON.stringify(publishedData.data, null, 2) }</pre>
			{/if}
		{/if}

	</div>

