<script lang='ts'>

	let {
		title,
		subtitle = undefined,
		children,
	} = $props();

</script>

	<span
		class='
			grow
			inline-block
			content-start
			w-[75%] resize-x
			bg-back-200
			rounded-tl-md
			pb-4 pe-4 ps-6
		'
	>
		{#if title && subtitle}

			<div class = 'pt-4 pr-2 rounded-md flex'>
				<span class='grow flex-wrap'>
					<h3 class='font-semibold ml-0'>
						{ title }
					</h3>
				</span>
				<span class='grow flex-wrap-reverse text-right'>
					<p class='font-semibold text-2xl'>
						{ subtitle }
					</p>
				</span>
			</div>

		{:else if title}
			<div class = 'pt-4 pr-2 pb-2 rounded-md'>
				<h3 class='text-left font-semibold'>
					{ title }
				</h3>
			</div>

		{/if}

		{@render children()}

	</span>