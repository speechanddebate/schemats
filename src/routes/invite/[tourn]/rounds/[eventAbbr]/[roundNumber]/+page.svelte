<script lang="ts">

	import { getContext } from 'svelte';
	import type { Webname } from '../../../inviteTypes';
	import Sidebar from '../../sidebar.svelte';
	import { indexFetch } from '$lib/indexfetch';

	const webname:Webname = getContext('webname');

	let roundList = indexFetch('/public/invite', {key: `${webname.tournId}/rounds`});
	const mySchools = indexFetch(`/public/invite/${webname.tournId}/myschools`);

</script>

	<div class="main">

		<h2>Listing of Schematic</h2>

		<pre>{ JSON.stringify(webname, null, 2) }</pre>

	</div>

	{#if roundList.status === 'success'}
		<Sidebar
			rounds  = {roundList.data}
			webname = {webname}
			schools = {mySchools.data}
		/>
	{/if}
