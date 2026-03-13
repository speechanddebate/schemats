<script lang="ts">

	import '../app.css';
	import Header from '$lib/layouts/Header.svelte';
	import Footer from '$lib/layouts/Footer.svelte';

	import { browser } from '$app/environment';
	import { QueryClient } from '@tanstack/svelte-query';
	import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';
	import { PersistQueryClientProvider } from '@tanstack/svelte-query-persist-client';
	import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';

	import { initSessionContext } from '$lib/context/PersonContext.svelte';
	import { createAuthLogout } from '$indexcards';
	import { goto, invalidateAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	import type { LayoutProps } from './$types';

	let { children, data }:LayoutProps = $props();

	initSessionContext(() => data.sessionData ?? null);

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled   : browser,
				staleTime : 60 * 100,
			},
		},
	});

	const persister = createAsyncStoragePersister({
		storage: browser ? window.localStorage : null,
	});

	const logout = async (event: Event) => {
		event.preventDefault();
		createAuthLogout(() => ({
			mutation: {
				onSuccess: () => {
					queryClient.invalidateQueries();
					goto(resolve(`${page.url.pathname}${page.url.search}`, {}), {
						replaceState: true,
						invalidateAll: true,
					});
				},
			},
		})).mutateAsync();
		await invalidateAll(); // Force reload +layout.server.ts
	};

</script>

<PersistQueryClientProvider
	client         = {queryClient}
	persistOptions = {{ persister }}
>

	<!-- Header called from top level layout.svelte -->
	<Header logoutFn={logout}/>

	<!-- Top level layout.svelte -->
	<main class= 'bg-linear-to-b from-primary-800 to-primary-500 px-6'>
		<div class='
			min-h-[80vh]
			border-warning-500
			border-x-2
			border-t-2
			rounded-t-md
			bg-back-200
		'>
			<!-- making this flex on the front page leads to the Gradually
			Growing bug that's driving me insane -- CLP -->

			<div class='w-full'>
				{@render children()}
			</div>
		</div>
	</main>
	<SvelteQueryDevtools />
	<Footer />
</PersistQueryClientProvider>
