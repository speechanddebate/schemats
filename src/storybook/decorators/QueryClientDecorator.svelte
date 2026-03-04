<script lang="ts">
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import type { Snippet } from 'svelte';
	import { QueryClient } from '@tanstack/svelte-query';

	const queryClient = new QueryClient({

	});

	let { children } : { children: Snippet } = $props();
	</script>

	<div>
	<QueryClientProvider client={queryClient}>
		{@render children()}
	</QueryClientProvider>
	</div>