<script lang="ts">

	// Tournament Invitation Main Page.

	import { fromStore } from 'svelte/store';
	import { idxQuery } from '$lib/helpers/utils.svelte';

	interface InviteParams {
		tournId: number | undefined,
		webname: string | undefined,
	}

	// This pattern leads to reactive data display in Svelte 5 & TanStack,
	// which is otherwise tricky.

	let { data }: {data:InviteParams } = $props();
	let key = $state(data.tournId || data.webname);

	let queryStore = $derived(idxQuery(key, 'public/invite'));
	let pageContent = $derived(fromStore(queryStore).current);

</script>

<div class="pb-8">

	{#if pageContent.isLoading || pageContent.isPending}
		<span class="py-8 text-2xl">Loading data...</span>
	{:else if pageContent.isError}
		<span>Error: {pageContent.error.message}</span>
	{:else}
		{#if pageContent.isFetching}
			<div style="color:darkgreen; font-weight:700">Data Updating...</div>
		{:else if pageContent.data.tourn }
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
					<h4>
						{ pageContent.data.tourn.name }
					</h4>
					<h5>
						{ new Date(pageContent.data.tourn.start) }
						&ndash;
						{ new Date(pageContent.data.tourn.start) }
					</h5>
					<h5>
						{ pageContent.data.tourn.city } &ndash;
						{ pageContent.data.tourn.state || pageContent.data.tourn.country }
					</h5>

					{#each pageContent.data.pages as page}
						{#if page.special === 'main'}
							YO
							{@html page.content}
						{/if}
					{/each}

					{#each pageContent.data.events as event}
						<h5>{event.name}</h5>
						<p>{event.abbr}</p>
						<p>${event.fee}</p>
						<p>{@html event.description}</p>
					{/each}

				</span>
				<span class="
					menu
					resize-x w-[25%]
					p-2 pl-4 pr-0
					content-start
					border-l-2 border-back-100
				">
					<span class="sidenote">
						<h4>Tournament Contacts</h4>

						{#each pageContent.data.contacts as contact}
							<a
								class = "green blue full"
								href  = "mailto:{ contact.email }"
							>
								{contact.first}
								{contact.middle}
								{contact.last}
							</a>
						{/each}

						{#if (pageContent.data.pages.length > 1)}
							<h4>Additional Information</h4>
							{#each pageContent.data.pages as page}
								{#if page.special !== 'main'}
									<a
										class="blue full"
										href="{page.id}"
									>
										{page.title}
									</a>
								{/if}
							{/each}
						{/if}

					</span>

				</span>
			</div>
		{:else}
			<div class="p-8">
				<h4>No such tournament was found</h4>
				<p>Tournament ID: {data.tournId || 'None Sent'}</p>
				<p>Tournament Webname: {data.webname || 'None Sent'}</p>
			</div>
		{/if}
	{/if}
</div>
