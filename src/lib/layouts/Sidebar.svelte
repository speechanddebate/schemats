<script lang='ts'>
	let { children } = $props();
</script>

	<span class="
		menu
		resize-x
		w-[25%]
		p-2
		px-2
		content-start
		border-l-2 border-back-300
		bg-back-200
		rounded-tr-lg
	">
		{@render children() }
	</span>