<script lang="ts">

	const { pageContent, slug } = $props();

</script>

<div>
	{#if $pageContent.status === 'pending'}
		<span>Loading...</span>
	{:else if $pageContent.status === 'error'}
		<span>Error: {$pageContent.error.message}</span>
	{:else}
		{#if $pageContent.isFetching}
			<div style="color:darkgreen; font-weight:700">Background Updating...</div>
		{:else if $pageContent.data?.length > 0 }
			<div
				class = "px-4 flex min-h-[80vh] override"
			>
				<span
					class="
						pt-4 pr-4
						w-[75%] resize-x flex-grow
						content-start
					"
				>
					<h2>
						{ $pageContent.data[0].title }
					</h2>

					{@html $pageContent.data[0].content }
				</span>

				{#if $pageContent.data[0].sidebar }
					<span class="
						menu
						resize-x w-[25%]
						p-2 pl-4 pr-0
						content-start
						border-l-2 border-back-100
					">
						{@html $pageContent.data[0].sidebar }
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
