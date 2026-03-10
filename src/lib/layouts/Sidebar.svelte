<script lang='ts'>
	let { children } = $props();
</script>

	<!-- lib/layouts/Sidebar.svelte -->
	<span class="
		menu
		block
		w-1/4
		h-full
		box-border
		p-4
		pt-4
		content-start
		border-l-2 border-back-300
		bg-back-100
		rounded-tr-lg
		float-right
		relative
	">
		{#if children}
			{@render children() }
		{/if}
	</span>