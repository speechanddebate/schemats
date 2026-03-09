<script lang="ts">
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import type { Snippet } from 'svelte';
	import { QueryClient } from '@tanstack/svelte-query';
	import { initPersonContext } from '$lib/context/PersonContext.svelte';
	import { faker } from '@faker-js/faker';

	const queryClient = new QueryClient({

	});

	let { children } : { children: Snippet } = $props();
	initPersonContext({
		id: faker.number.int(),
		name: faker.person.fullName(),
		email: faker.internet.email(),
		tz: faker.location.timeZone(),
	});

	</script>
	<div>
	<QueryClientProvider client={queryClient}>
		{@render children()}
	</QueryClientProvider>
	</div>