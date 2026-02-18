<script lang="ts">

	// This pattern leads to reactive data display in Svelte 5 & TanStack,
	// which is otherwise tricky.

	import { indexFetch } from '$lib/indexfetch';
	import { getContext } from 'svelte';
	import Sidebar from './sidebar.svelte';

	import type { Webname } from '../inviteTypes';

	const webname:Webname = getContext('webname');
	let roundList = indexFetch('/public/invite', {key: `${webname.tournId}/rounds`});
	const mySchools = indexFetch(`/public/invite/${webname.tournId}/myschools`);

</script>

	<div class="main">
		{#if roundList.status === 'pending'}
			<div class='text-success-500 font-semibold'>
				Data Loading...
			</div>
		{:else if roundList.status === 'error'}
			<span>Error: {roundList.error.detail}</span>
		{:else}

			{#if roundList.isFetching}
				<div class='text-success-500 font-semibold'>
					Data Updating...
				</div>
			{:else}

				<h5>Published Rounds</h5>
				<h6>Tournament { webname.tournId }</h6>
				<h6>Webname { webname.webname }</h6>
				{roundList.status}

				<pre>{ JSON.stringify(roundList.data, null, 2) }</pre>

			{/if}
		{/if}
	</div>

	{#if roundList.status === 'success'}
		<Sidebar
			rounds  = {roundList.data}
			schools = {mySchools.data}
			webname = {webname}
		/>
	{/if}
