<script lang="ts">
	// Event Area shell.  Translates the human readable URLs into machine
	// readable IDs.

	import { setContext } from 'svelte';
    import type { EventData } from '../../inviteTypes';
    import type { Snippet } from 'svelte';

	let { data, children }: {data: EventData, children:Snippet} = $props();

	// svelte-ignore state_referenced_locally
	setContext('eventData', data);

</script>

	{@render children?.()}
