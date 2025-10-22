<script lang="ts">
	import '../app.css';
	import Header from '$lib/layouts/Header.svelte';
	import Footer from '$lib/layouts/Footer.svelte';

	import { browser } from '$app/environment'
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query'
	import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';

	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled   : browser,
				staleTime : 60 * 1000,
			},
		},
	});

</script>

<QueryClientProvider client={queryClient}>
	<Header />
	<main class= 'bg-linear-to-b from-primary-800 to-primary-500 px-6'>
		<div class='
			min-h-[80vh]
			border-warning-500
			border-x-2
			border-t-2
			rounded-t-md
			bg-back-200
		'>
			<div class='flex w-full'>
				{@render children()}
			</div>
		</div>
	</main>
	<SvelteQueryDevtools />
	<Footer />
</QueryClientProvider>
