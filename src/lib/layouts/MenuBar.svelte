<script lang='ts'>
	let {
		menuProps = {},
	} = $props();
</script>

	<!-- lib/layouts/MainTitle.svelte here -->
	<div class='border-b'>
		i am a menu
		{ JSON.stringify(menuProps) }
	</div>
