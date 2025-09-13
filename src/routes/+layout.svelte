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
