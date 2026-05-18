<script lang="ts">
	const triggerClientError = (): void => {
		// Throw asynchronously so it is uncaught and picked up by window error handlers.
		setTimeout(() => {
			throw new Error('Manual client pipeline test error from /log page');
		}, 0);
	};
</script>

<main>
	<h1>Log Pipeline Test</h1>
	<button type="button" on:click={triggerClientError}>Trigger Client Error</button>
</main>
