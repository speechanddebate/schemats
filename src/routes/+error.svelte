<script>
	import { page } from '$app/state';
</script>

  <div class="w-full text-center">
	<h1>Error {page.status}</h1>
	<p>{page.error?.message}</p>

	{#if page.status === 404}
		<p>This page could not be found.</p>
	{/if}
  </div>
