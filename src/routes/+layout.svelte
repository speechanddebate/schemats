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
	<main class='bg-primary-1000 px-4'>
		<div class='bg-surface-100 rounded-md px-5 pt-1'>
			{@render children()}
		</div>
	</main>
	<SvelteQueryDevtools />
	<Footer />
</QueryClientProvider>
