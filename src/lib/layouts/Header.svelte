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
		class = 'items-start flex-nowrap flex-row bg-primary-1000 sm:px-2 xl:px-4'
		navContainerClass = 'flex-nowrap py-1 justify-stretch'
	>
		<NavBrand
			class = 'flex-wrap
				my-4
				xl:w-[310px]
			'
			href  = '/'
		>
			<div class="flex nowrap p-0 m-0 justify-center items-center">
				<img
					class = "
						xl:me-1
						xl:h-12 xl:w-12
						lg:h-10 lg:w-10 lg:mr-[4px]
						md:h-8 md:w-8
						h-7 w-7
						mr-[2px]
					"
					alt   = "Tabroom Logo"
					src   = "/img/tabroom-sparky.png"
				/>
				<div>
					<h1
						class="
							whitespace-nowrap font-semibold text-secondary-50
							text-[26px]
							md:leading-4 md:text-[26px]
							lg:text-3xl lg:tracking-wider lg:pt-1 lg:leading-5
							xl:tracking-wider xl:text-[2.5rem] xl:py-1
						"
					>
						TABROOM.COM
					</h1>
					<div class="
						text-primary-100 italic w-auto font-normal
						lg:inline lg:text-[11px] lg:tracking-tight
						xl:text-xs xl:text-[13px] xl:tracking-[.08em] xl:pl-1 xl:font-semibold
						hidden
					">
						National Speech &amp;
						Debate Association
					</div>
				</div>
			</div>

			<div class="
				text-[10px] text-primary-100 font-normal italic w-full
				pr-1
				tracking-normal whitespace-nowrap
				text-center
				lg:hidden
			">
				National Speech &amp; Debate Association
			</div>
		</NavBrand>

		<NavUl
			class       = '
				items-start text-base
				md:w-1/3 md:order-1 md:flex md:text-center
				lg:w-1/3
				order-4
				hidden
			'
			activeClass = "text-primary-100 decoration font-semibold
					decoration-error-300 underline decoration-solid decoration underline-offset-4
					hover:bg-amber-50 hover:text-error-900 hover:decoration-primary-500
					md:ps-2 md:pe-2
					lg:ps-2 lg:pe-2 lg:w-[9ex]
					xl:ps-2 xl:pe-2 xl:w-[12ex]
			"
			{activeUrl}
			nonActiveClass = "
				text-secondary-50 tracking-wide
				hover:text-warning-500 hover:text-primary-1000 hover:bg-secondary-100
				md:ps-2 md:pe-2
				lg:ps-2 lg:pe-2 lg:w-[9ex]
				xl:ps-2 xl:pe-2 xl:w-[12ex]
			"
			ulClass = '
				flex-col rtl:space-x-reverse flex-row
				md:flex md:justify-around
				md:p-2 md:text-xs md:font-medium

				lg:p-2 lg:mt-0 lg:text-sm

				xl:mt-0
				hidden
			'
		>
			<NavLi
				href  = "/"
			>Home</NavLi>

			<NavLi
				href="/circuits"
			>Circuits</NavLi>

			<NavLi
				href  = "/results"
			>Results</NavLi>

			<NavLi
				href  = "/paradigms"
			>Paradigms</NavLi>

			<NavLi
				href  = "/about"
			>Help</NavLi>
		</NavUl>

		<div class="flex grow w-1/12 order-2">
		</div>

		<!-- The Flowbite Svelte Search module proved to be a real PITA of obscurity -->

		<div class="text-stone-200 mx-1
			md:flex
			md:order-3 md:w-1/6 md:ml-2 mr-2
			xl:ps-1 xl:pe-1 xl:w-1/5
			hidden
		">
			<form class='w-full'>
			<label
				class = "mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
				for   = "default-search"
			>
				Search
			</label>
			<div class="relative">
				<div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
					<svg
						class       = "w-4 h-4 text-secondary-50"
						aria-hidden = "true"
						fill        = "none"
						viewBox     = "0 0 20 20"
						xmlns       = "http://www.w3.org/2000/svg"
					>
						<path
							d               = "m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
							stroke          = "currentColor"
							stroke-linecap  = "round"
							stroke-linejoin = "round"
							stroke-width    = "2"
						/>
					</svg>
				</div>
				<input
					id    = "default-search"
					class = "block w-full p-2 ps-9 text-xs italic
						rounded-lg
						bg-primary-900
						text-secondary-200
						border border-primary-900
						focus:border-secondary-100
						lg:placeholder-stone-300
						placeholder-transparent
					"
					placeholder = "Ctrl-s to search..."
					required
					type        = "search"
				/>
			</div>
			</form>
		</div>

		<div class="space-x-1 ml-2 mr-1
			md:order-3 md:w-auto
			lg:ml-4
			sm:w-1/2
		">
			{#if $sessionData.isSuccess}
				{#if $sessionData.data?.Person}
					<div class='py-3 lg:w-[160px] md:w-[128px]'>
						<div class="
							flex flex-row flex-nowrap align-middle
							md:justify-center md:pb-1
							justify-end pb-1
						">
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
							{#if $sessionData.data.Su}
								<div class="
									w-full text-warning-400 font-medium
									md:justify-center
									justify-end
								">
									{$sessionData.data?.Su?.email} as
								</div>
							{/if}
							<div class="
								w-full flex flex-nowrap
								text-primary-50 font-medium italic
								underline-offset-2 underline decoration-warning-500
								md:justify-center md:pt-1
								justify-end
							">
								{$sessionData.data?.email}
							</div>
						</a>
					</div>
				{:else}

					<div class="
						justify-center items-center justify-around
						w-[180px] flex
					">
						<a
							id = "signup-menu"
							class='
								text-stone-50
								bg-warning-500
								hover:bg-warning-600
								focus:ring-4 focus:outline-none focus:ring-warning-300
								font-medium rounded-md text-sm
								px-2 py-1.5
								text-center
								border border-warning-900
								hover:border-warning-300
							'
							type='button'
						>
							SIGN UP
						</a>

						<div class="relative">
							<Dropdown
								class       = "z-50
											bg-stone-50 border-primary-800
											border-l-2 border-r-2 border-b-2
											rounded pt-1 mr-2 text-center
											px-4 py-6"
								params      = {{ y: 0, duration: 200, easing: sineIn }}
								triggeredBy = "#signup-menu"
							>
								SIGN UP FOR TABROOM YOU BEAUTIFUL HUMAN BEING.
							</Dropdown>
						</div>

						<a
							id = 'login-menu'
							class='
								text-stone-50
								bg-success-700
								hover:bg-success-500
								focus:ring-4 focus:outline-none focus:ring-success-300
								font-medium rounded-md text-sm
								px-2 py-1.5
								text-center
								border border-success-900
								hover:border-success-300
							'
							type='button'
						>
							LOGIN
						</a>

						<div class="relative">
							<Dropdown
								class       = "z-50
											bg-stone-50 border-primary-800
											border-l-2 border-r-2 border-b-2
											rounded pt-1 mr-2"
								params      = {{ y: 0, duration: 200, easing: sineIn }}
								triggeredBy = "#login-menu"
							>
								<DropdownHeader
									class    = "px-2 pt-1
										border-b w-[360px] border-warning-700
										text-primary-1000
									"
									divClass = "py-1"
									divider  = {false}
								>
									Login:
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
							</Dropdown>
						</div>
					</div>

				{/if}
			{/if}
			<NavHamburger
				class="md:hidden"
			/>
		</div>
	</Navbar>
</div>
