<script lang="ts">

	// This pattern leads to reactive data display in Svelte 5 & TanStack,
	// which is otherwise tricky.
	import { indexFetch } from '$lib/indexfetch';
	import { getContext } from 'svelte';

	const tournId = getContext('inviteTournId');
	let roundList = $derived(indexFetch('/public/invite', {key: `${tournId}/rounds`}));

</script>

	<h4>Rounds</h4>

	<p>
		Path:
		{`public/invite/${tournId}/rounds`}
	</p>
	<pre>
		{ JSON.stringify(roundList.data, null, 2) }
	</pre>

