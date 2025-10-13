<script lang='ts'>

    import MenuBar from './MenuBar.svelte';

	let {
		title,
		subtitle = undefined,
		undertitle = undefined,
		menuProps = {},
	} = $props();

</script>

	<div class="
		w-full
		rounded-tl-md
		py-1
		flex
		"
	>
		<span
			class='
				content-start
				w-1/2 resize-x
				inline-block
				grow
			'
		>
			{#if title && subtitle}
				<div class = 'py-1 rounded-md flex items-center'>
					<span class='grow flex-wrap'>
						<h3 class='font-semibold ml-0'>
							{ title }
						</h3>
					</span>
					<span class='
						grow
						py-1
						items-center
						text-right
						italic
					'>
						<p class='font-semibold text-xl
							pb-0
						'>
							{ subtitle }
						</p>

						{#if undertitle}
							<p class='pb-0'>
								{ undertitle }
							</p>
						{/if}
					</span>
				</div>
			{:else if title}
				<div class = 'py-1 pr-2 rounded-md'>
					<h3 class='text-left font-semibold'>
						{ title }
					</h3>
				</div>
			{/if}
		</span>

		{#if Object.keys(menuProps).length > 0}
			<span
				id    = 'mainMenuBar'
				class = "w-1/2 p-2 text-right"
			>
				Yo
				<MenuBar menuProps={menuProps} />
			</span>
		{/if}

	</div>