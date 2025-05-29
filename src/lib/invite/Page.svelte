<script lang="ts">

	import { webpageApi } from '$lib/invite/api';
	import { createQuery } from '@tanstack/svelte-query';

	import type { Webpage } from '$lib/types/public.js';

	interface Props {
		slug: string,
	}

	let { slug }:Props = $props();

	console.log(`Calling page slug ${slug}`);

	const pageContent = createQuery<Webpage[], Error>({
		queryKey: ['publicPages', slug],
		queryFn: () => webpageApi().getPageBySlug(slug),
	});

</script>

<div>
	{#if $pageContent.status === 'pending'}
		<span>Loading...</span>
	{:else if $pageContent.status === 'error'}
		<span>Error: {$pageContent.error.message}</span>
	{:else}
		{#if $pageContent.isFetching}
			<div style="color:darkgreen; font-weight:700">Background Updating...</div>
		{:else if $pageContent.data?.length > 0 }

			<h2 class="text-4xl px-8 pt-10 font-semibold">
				{ $pageContent.data[0].title }
			</h2>
			<div
				class="p-8"
			>
				{@html $pageContent.data[0].content }
			</div>
		{:else} 
			<div
				class="p-8"
			>
				<h4>No page found for {slug}</h4>
			</div>
		{/if}
	{/if}
</div>
