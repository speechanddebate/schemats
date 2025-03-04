<script lang="ts">
	import '../app.css';
	import Header from '$lib/Header.svelte';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';
	import type { PageData } from './$types';
	import type { Snippet } from 'svelte';

	let { data, children }: { data: PageData; children: Snippet } = $props();
</script>

<QueryClientProvider client={data.queryClient}>
	<Header sessionData={data} />
	<main>
		{@render children()}
	</main>
	<SvelteQueryDevtools />
</QueryClientProvider>
