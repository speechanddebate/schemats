<script lang="ts">
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import type { Snippet } from 'svelte';
	import { QueryClient } from '@tanstack/svelte-query';
	import { initPersonContext } from '$lib/context/PersonContext.svelte';

	const queryClient = new QueryClient({

	});

	let { children } : { children: Snippet } = $props();
	initPersonContext(() => null);

	</script>
	<div>
	<QueryClientProvider client={queryClient}>
		{@render children()}
	</QueryClientProvider>
	</div>