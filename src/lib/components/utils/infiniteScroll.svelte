<script lang="ts">
	import type { CreateInfiniteQueryResult } from '@tanstack/svelte-query';
	import type { Snippet } from 'svelte';
	import type { Problem } from '$indexcards/schemas';

	import { Spinner } from 'flowbite-svelte';

	type Props = {
		query: CreateInfiniteQueryResult<unknown, Problem>;
		children?: Snippet;
		InfiniteScrollFooter?: Snippet;
	};

	const {
		query,
		children,
		InfiniteScrollFooter,
	}: Props = $props();

	function infiniteScrollSentinel(node: HTMLDivElement) {
		const observer = new IntersectionObserver(
			(entries) => {
				const entry = entries[0];

				if (
					entry?.isIntersecting &&
					query.hasNextPage &&
					!query.isFetchingNextPage &&
					!query.isLoading
				) {
					void query.fetchNextPage();
				}
			},
			{ rootMargin: '50px 0px' },
		);

		observer.observe(node);

		return {
			destroy() {
				observer.disconnect();
			},
		};
	}
</script>

{@render children?.()}

{#if query.isFetchingNextPage}
	{#if InfiniteScrollFooter}
		{@render InfiniteScrollFooter()}
	{:else}
		<div class="flex w-full justify-center items-center py-4">
			<Spinner color="primary" type="bars"/>
		</div>
	{/if}
{/if}

{#if query.hasNextPage}
	<div class="h-8 w-full" aria-hidden="true" use:infiniteScrollSentinel></div>
{/if}