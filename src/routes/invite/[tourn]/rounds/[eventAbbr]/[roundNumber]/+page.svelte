<script lang="ts">

	import { getContext } from 'svelte';
	import type { Webname } from '../../../inviteTypes';
	import Sidebar from '../../sidebar.svelte';
	import { indexFetch } from '$lib/indexfetch';

	const webname:Webname = getContext('webname');

	let roundList = indexFetch('/pages/invite', {key: `${webname.tournId}/rounds`});
	const mySchools = indexFetch(`/pages/invite/${webname.tournId}/myschools`);

</script>

	<div class="main">

		<h2>Listing of Schematic</h2>

		<pre>{ JSON.stringify(webname, null, 2) }</pre>

	</div>

	{#if roundList.status === 'success'}
		<Sidebar
			rounds  = {roundList.data}
			schools = {mySchools.data}
			webname = {webname}
		/>
	{/if}
