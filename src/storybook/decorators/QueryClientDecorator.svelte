<script lang="ts">
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import type { Snippet } from 'svelte';
	import type { Session } from '$indexcards/schemas';
	import { QueryClient } from '@tanstack/svelte-query';
	import { initSessionContext } from '$lib/helpers/SessionContext.svelte';
    import { setConfigContext } from '$lib/config/AppConfig';

	const queryClient = new QueryClient({

	});

	let {
		children,
		session = null,
	}: {
		children: Snippet;
		session?: Session | null;
	} = $props();

	setConfigContext({
		webUrl: 'https://tabroom.com',
		classicUrl: 'https://classic.tabroom.com',
	});
	initSessionContext(() => (session));

	</script>
	<div>
	<QueryClientProvider client={queryClient}>
		{@render children()}
	</QueryClientProvider>
	</div>