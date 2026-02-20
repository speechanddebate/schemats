<script lang="ts">
	import { page } from '$app/state';
	import { dev } from '$app/environment';
</script>

  <div class="w-full text-center p-8">
	<h1 class="text-4xl font-bold mb-4">Error {page.status}</h1>
	<p class="text-xl mb-4">{page.error?.message}</p>

	{#if page.status === 404}
		<p>This page could not be found.</p>
	{:else if page.status === 500}
		<p>The service is temporarily unavailable. Please try again later.</p>
	{/if}

	<!-- Show Problem details if available -->
	{#if page.error?.problem?.detail}
		<p class="mt-4 text-gray-600">{page.error.problem.detail}</p>
	{/if}

	<!-- Show additional error context in dev mode -->
	{#if dev && page.error}
		<details class="mt-8 text-left max-w-2xl mx-auto">
			<summary class="cursor-pointer font-semibold">Error Details (dev only)</summary>
			<pre class="mt-4 p-4 bg-gray-100 rounded overflow-auto text-sm">{JSON.stringify(page.error, null, 2)}</pre>
		</details>
	{/if}
  </div>
