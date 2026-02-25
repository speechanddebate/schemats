<script lang="ts">
	import '../app.css';
	import Header from '$lib/layouts/Header.svelte';
	import Footer from '$lib/layouts/Footer.svelte';

	import { browser } from '$app/environment';
	import { QueryClient } from '@tanstack/svelte-query';
	import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';
	import { PersistQueryClientProvider } from '@tanstack/svelte-query-persist-client';
	import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';

	import type { LayoutProps } from './$types';
    import { onMount } from 'svelte';

	const { children, data }: LayoutProps = $props();

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled   : browser,
				staleTime : 60 * 1000,
			},
		},
	});

	const persister = createAsyncStoragePersister({
		storage: browser ? window.localStorage : null,
	});

	onMount(() => {
		import('$lib/stores/userTimeZone').then(({ updateUserTimeZoneAndLocale }) => {
			updateUserTimeZoneAndLocale();
		});
	});

</script>

<PersistQueryClientProvider
	client         = {queryClient}
	persistOptions = {{ persister }}
>
	<Header isLoggedIn={data.isLoggedIn} sessionData={data.sessionData} />
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
</PersistQueryClientProvider>
