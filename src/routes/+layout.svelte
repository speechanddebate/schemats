<script lang="ts">

	import '../app.css';
	import Header from '$lib/layouts/Header.svelte';
	import Footer from '$lib/layouts/Footer.svelte';

	import { browser } from '$app/environment';
	import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';
	import { PersistQueryClientProvider } from '@tanstack/svelte-query-persist-client';
	import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';

	import { initSessionContext } from '$lib/context/SessionContext.svelte';
	import { createAuthLogout, createAuthSuEnd, createUserInboxUnread } from '$indexcards';
	import { goto, invalidateAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { safeExtract } from '$lib/helpers/query';

	import type { LayoutProps } from './$types';

	let { children, data }: LayoutProps = $props();

	initSessionContext(() => data.sessionData ?? null);

	const persister = createAsyncStoragePersister({
		storage: browser ? window.localStorage : null,
	});

	const logoutMutation = createAuthLogout(undefined,() => data.queryClient);
	const logout = async () => {
		await logoutMutation.mutateAsync();
		data.queryClient.invalidateQueries();
		goto(resolve(`${page.url.pathname}${page.url.search}`, {}), {
			replaceState: true,
			invalidateAll: true,
		});
		await invalidateAll(); // Force reload +layout.server.ts
	};

	const suEndMutation = createAuthSuEnd(undefined, () => data.queryClient);
	const suEnd = async () => {
		await suEndMutation.mutateAsync();
		data.queryClient.invalidateQueries();
		goto(resolve(`${page.url.pathname}${page.url.search}`, {}), {
			replaceState: true,
			invalidateAll: true,
		});
		await invalidateAll(); // Force reload +layout.server.ts
	};

	const notificationCountQuery = createUserInboxUnread(() => ({
		query: {
			enabled: !!data.sessionData,
		},
	}), () => data.queryClient);
	const notificationCount = $derived(safeExtract(notificationCountQuery)?.count ?? 0);

</script>

<PersistQueryClientProvider
	client         = {data.queryClient}
	persistOptions = {{ persister }}
>

	<!-- Header called from top level layout.svelte -->
	<Header logoutFn={logout} notificationCount={notificationCount} suEndFn={suEnd} />

	<!-- Top level layout.svelte -->
	<main class= 'bg-linear-to-b from-primary-800 to-primary-500 px-2 sm:px-6 min-h-full'>
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

			<div class='flex min-h-[80vh] w-full flex-col'>
				{@render children()}
			</div>
		</div>
	</main>
	<SvelteQueryDevtools />
	<Footer />
</PersistQueryClientProvider>
