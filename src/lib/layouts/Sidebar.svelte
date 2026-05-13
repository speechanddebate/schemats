<script lang='ts'>
	let { children, initialOpen = true } = $props();
	let isOpen = $derived(initialOpen);

	function toggleButtonState() {
		isOpen = !isOpen;
	}
</script>

	<!-- lib/layouts/Sidebar.svelte -->
	<div class="relative h-full w-0 {isOpen ? 'lg:w-1/4' : 'lg:w-0'}">
	<span class="
		menu
		block
		{isOpen ? 'w-64 lg:w-full p-2 lg:p-4' : 'w-0 lg:w-full p-0'}
		h-screen lg:h-full
		box-border
		pt-4
		content-start
		border-l-2 border-back-300
		bg-back-100
		rounded-tr-lg
		absolute top-0 right-0 z-50 lg:z-auto
		lg:float-right
		lg:relative
	">
	<button
	class="{isOpen ? '' : 'absolute top-2 -left-8 bg-back-100 border border-back-300 rounded-l px-1.5 py-1 text-sm'}"
	aria-label="Toggle sidebar visibility"
	onclick={toggleButtonState}
	>{isOpen ? '→' : '←'}</button>
	<div class="overflow-hidden {isOpen ? '' : 'hidden'}">
		{#if isOpen}
			{@render children() }
		{/if}
	</div>
	</span>
	</div>