
<script lang="ts">
  export const { error, status } = $props();
</script>

<div class="flex flex-col items-center justify-center h-full min-h-[80vh]">
  <h2 class="text-6xl font-bold mb-4">{status === 404 ? '404' : status}</h2>
  <h3 class="text-2xl mb-2">{status === 404 ? 'Page Not Found' : 'An error occurred'}</h3>
  <p class="mb-6">{error?.message || 'Sorry, the page you are looking for does not exist.'}</p>
  <a href="/" class="px-4 py-2 bg-primary-900 font-bold rounded hover:bg-primary-400 transition" style="color: white; margin-top: 1rem">Go Home</a>
</div>