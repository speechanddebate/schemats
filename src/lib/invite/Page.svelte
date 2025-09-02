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
		<span>Loading...</span>
	{:else if fetchStatus === 'error'}
		<span>Error: {fetchError.message}</span>
	{:else}
		{#if isFetching}
			<div style="color:darkgreen; font-weight:700">Background Updating...</div>
		{:else if pageData?.length > 0 }
			<div
				class = "flex min-h-[80vh] override"
			>
				<span
					class="
						pt-4 pl-8 pr-4 pb-8
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
						sidebar
						menu
						resize-x w-[25%]
						p-2
						content-start
						border-l border-back-400
						bg-back-200
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
