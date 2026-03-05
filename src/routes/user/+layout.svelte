<script lang="ts">
	import { indexFetch } from '$lib/indexfetch';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	const sessionData = indexFetch('/user/session');

	const navItems = [
		{ label: 'Home',          href: '/user/home' },
		{ label: 'Inbox',         href: '/user/inbox' },
		{ label: 'Dashboard',     href: '/user/dashboard' },
		{ label: 'Ballots',       href: '/user/judge/ballots' },
		{ label: 'Profile',       href: '/user/profile' },
		{ label: 'Password',      href: '/user/password' },
	];

	let activeUrl = $derived(page.url.pathname);
</script>

<div class="w-full px-4 ps-8 bg-back-200">
	<div class="flex w-full">
		<div class="main">
			{#if sessionData.isSuccess && sessionData.data?.id}
				{@render children()}
			{:else}
				<h4>Please log in to access this page.</h4>
				<p>Use the Login button in the header to sign in to your Tabroom account.</p>
			{/if}
		</div>

		<div class="sidebar w-[26%] min-w-[200px] bg-back border-t border-back-800">
			<div class="menu p-2">
				<div class="sidenote">
					{#if sessionData.isSuccess && sessionData.data?.Person}
						<h5 class="my-0 border-b-1 border-secondary-500 pb-0 leading-8 mb-2">
							{sessionData.data.Person.first} {sessionData.data.Person.last}
						</h5>
						<p class="text-xs italic mb-3">{sessionData.data.Person.email}</p>
					{/if}

					{#each navItems as item (item.href)}
						<a
							class="blue full bg-back-100 text-sm
								border-s-2 border-primary-400
								border-y-1 border-y-back-300
								hover:bg-back-200 p-1 ps-2
								{activeUrl === item.href ? 'font-semibold bg-secondary-200 border-s-secondary-500' : ''}"
							href={resolve(item.href, {})}
						>{item.label}</a>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
