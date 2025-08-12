<script lang="ts">

	const { 
		fetchError,
		fetchStatus,
		pageData,
		isFetching,
		slug,
	} = $props();

</script>

<div class="pb-8">
	{#if fetchStatus === 'pending'}
		<span>Loading...</span>
	{:else if fetchStatus === 'error'}
		<span>Error: {fetchError.message}</span>
	{:else}
		{#if isFetching}
			<div style="color:darkgreen; font-weight:700">Background Updating...</div>
		{:else if pageData?.length > 0 }
			<div
				class = "px-4 flex min-h-[80vh] override"
			>
				<span
					class="
						pt-4 pr-4
						w-[75%] resize-x grow
						content-start
					"
				>
					<h2>
						{ pageData[0].title }
					</h2>

					{@html pageData[0].content }
				</span>

				{#if pageData[0].sidebar || slug === 'help' }
					<span class="
						menu
						resize-x w-[25%]
						p-2 pl-4 pr-0
						content-start
						border-l-2 border-back-100
					">
						{@html pageData[0].sidebar }
					</span>
				{/if}
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
