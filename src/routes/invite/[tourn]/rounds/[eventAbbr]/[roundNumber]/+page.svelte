<script lang="ts">

	import { getContext } from 'svelte';
	import type { Webname } from '../../../inviteTypes';

	const webname:Webname = getContext('webname');

</script>

	<div class="main">

		<h2>Listing of Schematic</h2>

		<pre>{ JSON.stringify(webname, null, 2) }</pre>

	</div>

