<script lang="ts">

	import { authApi } from '$lib/auth/api';
	import type { Session } from '$lib/types/user.ts';
	import { createQuery } from '@tanstack/svelte-query';

	const sessionData = createQuery<Session, Error>({
		queryKey: ['userSession'],
		queryFn: () => authApi().getSession(),
	});

	import {
		Avatar,
		Button,
		Navbar,
		NavBrand,
		NavLi,
		NavUl,
		NavHamburger,
		Dropdown,
		DropdownHeader,
		DropdownItem,
		DropdownDivider,
		Search,
	} from 'flowbite-svelte';

	import { sineIn } from 'svelte/easing';
	import SearchOutline from 'flowbite-svelte-icons/SearchOutline.svelte';
	import HomeSolid from 'flowbite-svelte-icons/HomeSolid.svelte';
	import EnvelopeSolid from 'flowbite-svelte-icons/EnvelopeSolid.svelte';
	import { page } from '$app/state';

	$: activeUrl = page.url.pathname;

</script>

<div>
	<Navbar
		class = 'items-start flex-nowrap justify-start flex-row bg-primary-1000 sm:px-2 xl:px-4'
		navContainerClass = 'flex-nowrap max-w-none px-2'
	>
		<NavBrand
			class = 'space-x-0 space-r-1 xl:space-r-3 w-1/4'
			href  = '/'
		>
			<img
				class = "xl:me-1 h-12 sm:h-12"
				alt   = "Tabroom Logo"
				src   = "/img/tabroom-sparky.png"
			/>
			<div>
				<h1
					class="
						whitespace-nowrap text-xl xl:text-4xl lg:text-3xl font-semibold tracking-wider
						text-secondary-50
					"
				>
					TABROOM.COM
				</h1>
				<div class="lg:text-[11px] xl:text-xs text-primary-100 italic font-normal pr-4">
					National Speech &amp;
					Debate Association
				</div>
			</div>
		</NavBrand>

		<NavUl
			class       = 'order-1 items-start text-base w-auto grow'
			activeClass = "text-primary-100 decoration font-semibold
					decoration-error-300 underline decoration-solid decoration underline-offset-4"
			{activeUrl}
			nonActiveClass = "text-secondary-50 hover:text-warning-500 tracking-wide"
			ulClass = 'flex flex-col p-4 mt-4 md:flex-row md:space-x-8 content-evenly
				rtl:space-x-reverse
				md:mt-0 md:text-sm md:font-medium'

		>
			<NavLi
				class = "space-x-4 xl:space-x-8 grow"
				href  = "/"
			>Home
			</NavLi>

			<NavLi
				class="space-x-4 md:space-x-4 xl:space-x-8 grow"
				href="/circuits">Circuits
			</NavLi>

			<NavLi
				class="space-x-4 md:space-x-4 xl:space-x-8 grow"
				href="/results">Results</NavLi
			>

			<NavLi
				class = "space-x-4 md:space-x-4 xl:space-x-8 grow"
				href  = "/paradigms">Paradigms</NavLi
			>
		</NavUl>

		<Search
			id    = "search-navbar"
			class = "bg-primary-900 p-2
					text-xs placeholder-stone-300 italic
					"
			placeholder = "Ctrl-s to search..."
			wrapperClass = "md:order-2 text-stone-200 grow flex md:mr-6"
		>
		</Search>

		<div class="space-x-1 md:order-3 md:ml-4 mr-4">
			{#if $sessionData.isSuccess}
				<div class='py-3'>
					<div class="flex flex-row flex-nowrap justify-center align-middle pb-1">
						<a
							class="
								text-md
								bg-stone-50
								relative flex items-center justify-center
								text-primary-800
								hover:text-warning-600
								w-9 h-9 px-2 mr-2
								rounded-full border
							"
							href="/user/home"
						>
							<HomeSolid />
						</a>
						<a
							class="
								text-md
								bg-stone-50
								relative flex items-center justify-center
								text-primary-800
								hover:text-warning-600
								w-9 h-9 px-2 mr-2
								rounded-full border
							"
							href="/user/inbox"
						>
							<EnvelopeSolid />
						</a>
							<Avatar
								id    = "account-menu"
								class = "
									text-lg
									bg-stone-50
									text-primary-700
									hover:bg-primary-700
									hover:text-amber-50
									border-2  border-warning-400
									p-3
									w-9 h-9 font-bold"
							>
							{
								Array.from($sessionData?.data?.Person?.first)[0]
							}{
								Array.from($sessionData?.data?.Person?.last)[0]
							}
						</Avatar>
						<div class="relative">
							<Dropdown
								class       = "absolute -left-[110px] top-[14px] md:-left-[160px] z-50
											bg-stone-50 border-primary-800 border-l border-r border-b"
								params      = {{ y: 0, duration: 200, easing: sineIn }}
								triggeredBy = "#account-menu"
							>
								<DropdownHeader class="px-4 py-2">
									<span class="block text-sm text-gray-900 dark:text-white">
										{$sessionData.data?.name}
									</span>
									<span class="block truncate text-sm font-medium"
										>{$sessionData.data?.email}</span
									>
								</DropdownHeader>
									<DropdownItem href="/user/home">Home</DropdownItem>
									<DropdownItem href="/user/inbox">Message Inbox</DropdownItem>
									<DropdownItem href="/user/dashboard">Dashboard</DropdownItem>
									<DropdownItem href="/user/judge/ballots">Ballots</DropdownItem>
									<DropdownItem href="/user/proile">Account Profile</DropdownItem>
									<DropdownItem href="/user/password">Change Password</DropdownItem>
								<DropdownDivider class="bg-blue-500"/>
									<DropdownItem
										class="px-4 py-2 pt-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
										>Sign out</DropdownItem>
							</Dropdown>
						</div>
					</div>
					<div
						class="
						flex flex-row flex-nowrap justify-center align-middle
						text-xs text-center italic
						pt-1 text-primary-50 font-medium
						underline-offset-2 underline decoration-warning-500"
					>
						{#if $sessionData.isSuccess}
							{$sessionData.data?.email}
						{/if}
					</div>
				</div>
			{/if}
			<NavHamburger />
		</div>
	</Navbar>
</div>
