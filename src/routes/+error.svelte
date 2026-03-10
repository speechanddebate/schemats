<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="flex h-full min-h-[80vh] flex-col items-center justify-center">
	{#if (page.status === 404)}
		<h2 class="mb-4 text-6xl font-bold">{page.status}</h2>
		<h3 class="mb-2 text-2xl">Page Not Found</h3>
	{:else}
		<h2 class="mb-4 text-6xl font-bold">{page.status}</h2>
		<h3 class="mb-2 text-2xl">An unexpected error occurred.</h3>
		<p class="text-sm text-gray-600">If you report this error to Tabroom.com staff, please include the error Id</p>
		<p class="text-sm text-gray-600">Error ID: {page.error?.errorId}</p>
	{/if}

	<a
		style="color: white; margin-top: 1rem"
		class="rounded bg-primary-900 px-4 py-2 font-bold transition hover:bg-primary-400"
		href="/"
	>
		Go Home
	</a>
</div>