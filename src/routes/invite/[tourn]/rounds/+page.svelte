<script lang="ts">

	// This pattern leads to reactive data display in Svelte 5 & TanStack,
	// which is otherwise tricky.
	import { idxQuery } from '$lib/helpers/utils.svelte';
	import { getContext } from 'svelte';
	import { fromStore } from 'svelte/store';

	const key:string | number = getContext('inviteKey');
	let queryStore = $derived(idxQuery({key, path: 'public/invite'}));
	let pageContent = $derived(fromStore(queryStore).current);

	const tournId = $derived(pageContent.data?.tourn?.id);
	let queryRounds = $derived(idxQuery({key: `${tournId}/rounds`, path: `public/invite`}));
	let roundList = $derived(fromStore(queryRounds).current);

</script>

	<h4>Rounds</h4>

	<p>
		Path:
		{`public/invite/${tournId}/rounds`}
	</p>
	<pre>
		{ JSON.stringify(roundList.data, null, 2) }
	</pre>

