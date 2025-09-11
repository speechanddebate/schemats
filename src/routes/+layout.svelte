<script lang="ts">
	import '../app.css';
	import Header from '$lib/layouts/Header.svelte';
	import Footer from '$lib/layouts/Footer.svelte';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';
	import type { PageData } from './$types';
	import type { Snippet } from 'svelte';

	let { data, children }: { data: PageData; children: Snippet } = $props();

</script>

<QueryClientProvider client={data.queryClient}>
	<Header />
	<main class= 'bg-gradient-to-b from-primary-800 to-primary-500 px-6'>
		<div class='bg-surface-100 min-h-[80vh]
			border-x-2 border-warning-400
			border-t-1
			rounded-t-md
		'>
			{@render children()}
		</div>
	</main>
	<SvelteQueryDevtools />
	<Footer />
</QueryClientProvider>
