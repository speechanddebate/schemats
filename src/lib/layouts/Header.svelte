<script lang="ts">

	import { sessionApi } from '$lib/layouts/api';
	import type { Session } from '$lib/types/user.ts';
	import { createQuery } from '@tanstack/svelte-query';

	const sessionData = createQuery<Session, Error>({
		queryKey: ['userSession'],
		queryFn: () => sessionApi().getSession(),
	});

	import {
		Avatar,
		Navbar,
		NavBrand,
		NavLi,
		NavUl,
		NavHamburger,
		Dropdown,
		DropdownHeader,
		DropdownItem,
		DropdownDivider,
	} from 'flowbite-svelte';

	import { sineIn } from 'svelte/easing';
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
			class = 'space-x-0 space-r-1 xl:space-r-3'
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
			ulClass = 'flex flex-col p-4 mt-4 md:flex-row md:space-x-4
				rtl:space-x-reverse
				md:mt-0 md:text-sm md:font-medium'

		>
			<NavLi
				class = "space-x-4 xl:space-x-8 grow font-semibold"
				href  = "/"
			>Home
			</NavLi>

			<NavLi
				class="space-x-4 md:space-x-4 xl:space-x-8 grow font-semibold"
				href="/circuits">Circuits
			</NavLi>

			<NavLi
				class = "space-x-4 md:space-x-4 xl:space-x-8 grow font-semibold"
				href  = "/results">Results
			</NavLi>

			<NavLi
				class = "space-x-4 md:space-x-4 xl:space-x-8 grow font-semibold"
				href  = "/paradigms">Paradigms
			</NavLi>
		</NavUl>

		<!-- The Flowbite Svelte Search module proved to be a real PITA of obscurity -->

		<form class="gap-1 md:order-2 text-stone-200 grow flex md:mr-8">
			<label
				class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
				for="default-search"
			>
				Search
			</label>
			<div class="relative grow">
				<div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
					<svg
						class       = "w-4 h-4 text-secondary-50"
						aria-hidden = "true"
						fill        = "none"
						viewBox     = "0 0 20 20"
						xmlns       = "http://www.w3.org/2000/svg"
					>
						<path
							d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
						/>
					</svg>
				</div>
				<input
					id    = "default-search"
					class = "block w-full p-2 ps-9 text-xs italic
						text-secondary-200
						border border-warning-300 rounded-lg
						placeholder-stone-300
						focus:ring-blue-500 focus:border-blue-500
						bg-primary-900
						dark:bg-gray-700 dark:border-gray-600
						dark:placeholder-stone-200 dark:text-white
						dark:focus:ring-blue-500 dark:focus:border-blue-500"
					placeholder = "Ctrl-s to search..."
					required
					type = "search"
				/>
			</div>
		</form>

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
								class       = "absolute md:-left-[128px] z-50
											bg-stone-50 border-primary-800
											border-l-2 border-r-2 border-b-2
											rounded pt-1"
								params      = {{ y: 0, duration: 200, easing: sineIn }}
								triggeredBy = "#account-menu"
							>
								<DropdownHeader class="px-4 py-1 border-b border-warning-700
									text-primary-1000
								">
									<span class="block truncate text-xs font-semibold">
										{$sessionData.data?.name}
									</span>
									<span class="block truncate text-xs font-medium">
										{$sessionData.data?.email}
									</span>
								</DropdownHeader>

									<DropdownItem href="/user/home">Home</DropdownItem>
									<DropdownItem href="/user/inbox">Message Inbox</DropdownItem>
									<DropdownItem href="/user/dashboard">Dashboard</DropdownItem>
									<DropdownItem href="/user/judge/ballots">Ballots</DropdownItem>
									<DropdownItem href="/user/proile">Account Profile</DropdownItem>
									<DropdownItem href="/user/password">Change Password</DropdownItem>
									<DropdownDivider divClass='my-1 h-px bg-warning-900 dark:bg-gray-600' />
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
			<NavHamburger
				class="md:hidden"
			/>
		</div>
	</Navbar>
</div>
