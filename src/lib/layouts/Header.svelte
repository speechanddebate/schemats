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
		navContainerClass = 'flex-nowrap py-2'
	>
		<NavBrand
			class = 'flex-wrap xl:w-1/4 grow-1'
			href  = '/'
		>
			<div class="flex nowrap p-0 m-0 justify-center">
				<img
					class = "xl:me-1 lg:h-12 lg:w-12 h-8 w-8 mt-1 xl:h-16 xl:w-16"
					alt   = "Tabroom Logo"
					src   = "/img/tabroom-sparky.png"
				/>
				<div class="flex flex-wrap">
					<h1
						class="
							whitespace-nowrap text-[26px] xl:text-5xl lg:text-3xl font-semibold tracking-wider
							xl:tracking-wide
							text-secondary-50
						"
					>
						TABROOM.COM
					</h1>
					<div class="invisible h-0 lg:h-auto lg:visible lg:text-[11px] xl:text-xs
						text-primary-100 italic pr-4 w-full xl:text-[13px] xl:tracking-wide xl:pl-1
						font-normal xl:font-semibold
					">
						National Speech &amp;
						Debate Association
					</div>
				</div>
			</div>

			<div class="lg:invisible text-[11px] lg:h-0
				pr-4 w-full
				text-center italic
				text-primary-100 font-normal
			">
					National Speech &amp;
					Debate Association
				</div>
		</NavBrand>

		<NavUl
			class       = 'order-1 items-start text-base w-auto grow xl:grow-3 xl:w-1/4'
			activeClass = "text-primary-100 decoration font-semibold
					decoration-error-300 underline decoration-solid decoration underline-offset-4
					lg:ps-3 lg:pe-4
					md:ps-1 md:pe-1
					xl:ps-0 xl:pe-0
			"
			{activeUrl}
			nonActiveClass = "text-secondary-50 hover:text-warning-500 tracking-wide
				lg:ps-3 lg:pe-4
				md:ps-1 md:pe-1
			"
			ulClass = 'flex flex-col
				lg:p-4 lg:mt-2
				md:py-2 md:pr-6 pl-0
				md:mt-2
				md:flex-row
				lg:space-x-4
				md:space-x-1
				rtl:space-x-reverse
				md:mt-0 md:text-xs
				md:font-medium
				lg:text-sm
				xl:mt-0
				'
		>
			<NavLi
				class = "grow font-semibold lg:ml-2 md:ml-1 xl:ml-0 xl:pl-2 xl:w-[72px]"
				href  = "/"
			>Home
			</NavLi>

			<NavLi
				class="grow font-semibold lg:ml-2 md:ml-1 xl:ml-0 xl:pl-2 xl:w-[80px]"
				href="/circuits">Circuits
			</NavLi>

			<NavLi
				class = "grow font-semibold lg:ml-2 md:ml-1 xl:ml-0 xl:pl-2 xl:w-[80px]"
				href  = "/results">Results
			</NavLi>

			<NavLi
				class = "grow font-semibold lg:ml-2 md:ml-1 xl:m-0"
				href  = "/paradigms">Paradigms
			</NavLi>
		</NavUl>

		<!-- The Flowbite Svelte Search module proved to be a real PITA of obscurity -->

		<form class="gap-1 xl:ps-2 md:order-2 text-stone-200 grow xl:grow-3 flex lg:mr-8 mr-1">
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

		<div class="space-x-1 md:order-3 lg:ml-4 ml-2 mr-1">
			{#if $sessionData.isSuccess}
				<div class='py-3 lg:w-[160px] md:w-[128px]'>
					<div class="flex flex-row flex-nowrap justify-center align-middle pb-1">
						<a
							class="
								lg:text-md
								text-sm
								bg-stone-50
								relative flex items-center justify-center
								text-primary-800
								hover:text-warning-600
								sm:w-7 sm:h-7
								lg:w-9 lg:h-9
								px-2 mr-2
								rounded-full border
							"
							href="/user/home"
						>
							<HomeSolid />
						</a>
						<a
							class="
								lg:text-md
								text-sm
								bg-stone-50
								relative flex items-center justify-center
								text-primary-800
								hover:text-warning-600
								sm:w-7 sm:h-7
								lg:w-9 lg:h-9 px-2 mr-2
								rounded-full border
							"
							href="/user/inbox"
						>
							<EnvelopeSolid />
						</a>
							<Avatar
								id    = "account-menu"
								class = "
									lg:text-lg
									text-md
									bg-stone-50
									text-primary-700
									hover:bg-primary-700
									hover:text-amber-50
									border-2  border-warning-400
									p-3
									sm:w-7 sm:h-7
									lg:w-9 lg:h-9
									font-bold"
							>
							{
								Array.from($sessionData?.data?.Person?.first)[0]
							}{
								Array.from($sessionData?.data?.Person?.last)[0]
							}
						</Avatar>
						<div class="relative">
							<Dropdown
								class       = "z-50
											bg-stone-50 border-primary-800
											border-l-2 border-r-2 border-b-2
											rounded pt-1 mr-2"
								params      = {{ y: 0, duration: 200, easing: sineIn }}
								triggeredBy = "#account-menu"
							>
								<DropdownHeader
									class    = "px-2 pt-1 border-b w-[160px] border-warning-700 text-primary-1000"
									divClass = "py-1"
									divider  = {false}
								>
									<span class="block truncate text-xs font-semibold">
										{$sessionData.data?.name}
									</span>
									<span class="block truncate text-[10px] italic font-medium">
										{$sessionData.data?.email}
									</span>
								</DropdownHeader>
								<DropdownItem
									class="text-sm hover:bg-gray-200 dark:hover:bg-neutral-600 py-2"
									href="/user/home">Home</DropdownItem>
								<DropdownItem
									class="text-sm hover:bg-gray-200 dark:hover:bg-neutral-600 py-2"
									href="/user/inbox">Notifications</DropdownItem>
								<DropdownItem
									class="text-sm hover:bg-gray-200 dark:hover:bg-neutral-600 py-2"
									href="/user/dashboard">Dashboard</DropdownItem>
								<DropdownItem
									class="text-sm hover:bg-gray-200 dark:hover:bg-neutral-600 py-2"
									href="/user/judge/ballots">Ballots</DropdownItem>
								<DropdownItem
									class="text-sm hover:bg-gray-200 dark:hover:bg-neutral-600 py-2"
									href="/user/proile">Profile</DropdownItem>
								<DropdownItem
									class="text-sm hover:bg-gray-200 dark:hover:bg-neutral-600 py-2"
									href="/user/password">Password</DropdownItem>
								<DropdownDivider divClass='h-px bg-warning-900 dark:bg-gray-600' />
								<DropdownItem
									class="pl-6 px-2 text-xs hover:bg-gray-200 dark:hover:bg-neutral-600
										font-medium text-left"
								>Sign out of Tabroom
								</DropdownItem>
							</Dropdown>
						</div>
					</div>
					<a
						class = "flex flex-row flex-wrap align-middle justify-end
							lg:text-xs text-center text-[10px]"
						href  = "/user/home"
						title = "{$sessionData.data?.email}"
					>
						{#if $sessionData.isSuccess}
							{#if $sessionData.data.Su}
								<div class="
									w-full justify-center
									text-warning-400 font-medium
								">
									{$sessionData.data?.Su?.email} as
								</div>
							{/if}
							<div class="
								w-full flex flex-nowrap
								italic justify-center
								pt-1 text-primary-50 font-medium
								underline-offset-2 underline decoration-warning-500
							">
								{$sessionData.data?.email}
							</div>
						{/if}
					</a>
				</div>
			{/if}
			<NavHamburger
				class="md:hidden"
			/>
		</div>
	</Navbar>
</div>
