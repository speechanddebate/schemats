<script lang='ts'>
	let { children } = $props();
</script>

	<span class="
		menu
		resize-x
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
		<div class="mt-2 mb-1 p-2 bg-white bg-no-repeat bg-right-top border border-gray-400 rounded-lg">
			{@render children() }
		</div>
		{/if}
	</span>