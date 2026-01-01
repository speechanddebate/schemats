<script lang="ts">

	const {
		fetchError,
		fetchStatus,
		pageData,
		isFetching,
		slug,
	} = $props();

</script>

<div>
	{#if fetchStatus === 'pending'}
		<div class='text-success-500 font-semibold'>
			Data Loading...
		</div>
	{:else if fetchStatus === 'error'}
		<span>Error: {fetchError.message}</span>
	{:else}

		{#if isFetching}
			<div class='text-success-500 font-semibold'>
				Data Updating...
			</div>
		{:else if pageData?.length > 0 }
			<div
				class = "flex flex-wrap min-h-[80vh] override px-4"
			>
				<div class='
					flex w-full
					pl-4 pr-3
				'>
					<span class='
						w-1/2 resize-x grow
						py-2 content-start
					'>
						<h2>
							{ pageData[0].title }
						</h2>
					</span>

					{#if pageData[0].subtitle}
						<span
							class="w-1/2 p-4 content-start"
						>
							{ pageData[0].subtitle }
						</span>
					{/if}
				</div>

				<div
					class='flex w-full'
				>
					<span
						class="
							pt-4 pl-8 pr-4 pb-8
							w-[72%] resize-x grow
							content-start
							bg-back
							border-t border-r
							border-primary-800
							rounded-t-md
							border-l border-l-secondary-400
						"
					>
						{@html pageData[0].content }
					</span>

					{#if pageData[0].sidebar || slug === 'help' }
						<span class="
							sidebar
							menu
							resize-x
							w-[28%]
							ms-2 ps-1
							pb-4
							content-start
							border-l border-l-back-400
							bg-back-200
						">
							{@html pageData[0].sidebar }
						</span>
					{/if}

				</div>
			</div>
		{:else}
			<div
				class="p-8"
			>
				<h4>No page found for {slug}</h4>
			</div>
		{/if}
	{/if}
</div>
