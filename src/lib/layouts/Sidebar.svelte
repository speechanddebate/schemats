<script lang='ts'>
	let { children } = $props();
</script>

	<span class="
		menu
		w-[32%]
		max-w-[310px]
		p-4
		pt-4
		content-start
		border-l-2 border-back-300
		bg-back-100
		rounded-tr-lg
		float-right
		relative
		min-h-screen
	">
		{#if children}
			{@render children() }
		{/if}
	</span>