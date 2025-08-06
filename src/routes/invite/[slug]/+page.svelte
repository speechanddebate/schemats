<script lang="ts">

	import { inviteApi } from '$lib/invite/api';
	import { createQuery } from '@tanstack/svelte-query';
	import { P } from 'flowbite-svelte';

	let { data } = $props();
	let webname = $derived(data.webname);
	let tournId = $derived(data.tournId);
	let pageContent = $state({});

	pageContent = createQuery({
		queryKey : ['tournInvite', data.webname, data.tournId],
		queryFn  : () => inviteApi().getInviteByTourn({webname, tournId}),
	});

	$effect(() => {
		pageContent = createQuery({
			queryKey : ['tournInvite', webname, tournId],
			queryFn  : () => inviteApi().getInviteByTourn({webname, tournId}),
		});
	});

</script>

<div class="pb-8">
	{#if $pageContent.status === 'pending'}
		<span>Loading...</span>
	{:else if $pageContent.status === 'error'}
		<span>Error: {$pageContent.error.message}</span>
	{:else}
		{#if $pageContent.isFetching}
			<div style="color:darkgreen; font-weight:700">Data Updating...</div>
		{:else if $pageContent.data }
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
					<h4>
						{ $pageContent.data.tourn.name }
					</h4>
					<h5>
						{ new Date($pageContent.data.tourn.start) } &ndash; { new Date($pageContent.data.tourn.start) }
					</h5>
					<h5>
						{ $pageContent.data.tourn.city } &ndash;
						{ $pageContent.data.tourn.state || $pageContent.data.tourn.country }
					</h5>

					{#each $pageContent.data.pages as page}
						{#if page.special === 'main'}
							YO
							{@html page.content}
						{/if}
					{/each}

					{#each $pageContent.data.events as event}
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

						{#each $pageContent.data.contacts as contact}
							<a class="green blue full" href="mailto:{ contact.email}">
								{contact.first}
								{contact.middle}
								{contact.last}
							</a>
						{/each}

						{#if ($pageContent.data.pages.length > 1)} 
							<h4>Additional Information</h4>
							{#each $pageContent.data.pages as page}
								{#if page.special !== 'main'}
									<a href="{page.id}" class="blue full">
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
				<h4>No tournament found</h4>
				{#if tournId}
					<p>Tournament ID {tournId}</p>
				{/if}
				{#if webname}
					<p>Tournament Webname {webname}</p>
				{/if}
			</div>
		{/if}
	{/if}
</div>
