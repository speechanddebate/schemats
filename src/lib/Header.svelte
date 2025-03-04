<script lang="ts">
	import {
		Navbar,
		NavBrand,
		NavUl,
		NavLi,
		uiHelpers,
		NavHamburger,
		Dropdown,
		DropdownHeader,
		DropdownUl,
		DropdownLi,
		Avatar,
		Button,
		Input,
		DropdownFooter,
	} from 'svelte-5-ui-lib';

	import { sineIn } from 'svelte/easing';
	import SearchOutline from 'flowbite-svelte-icons/SearchOutline.svelte';
	import HomeSolid from 'flowbite-svelte-icons/HomeSolid.svelte';
	import EnvelopeSolid from 'flowbite-svelte-icons/EnvelopeSolid.svelte';

	import { page } from '$app/state';

	let activeUrl          = $state(page.url.pathname);
	let nav                = uiHelpers();
	let navStatus          = $state(false);
	let toggleNav          = nav.toggle;
	let dropdownUser       = uiHelpers();
	let dropdownUserStatus = $state(false);
	let closeDropdownUser  = dropdownUser.close;

	$effect(() => {
		dropdownUserStatus = dropdownUser.isOpen;
		navStatus          = nav.isOpen;
		activeUrl          = page.url.pathname;
	});

	let { sessionData } = $props();

</script>

<div class="border-b-2 border-b-primary-800">
	<Navbar
		div2Class     = "p-2 mt-1 flex-grow"
		divClass      = "items-start flex-nowrap max-w-none justify-start flex-row"
		hamburgerMenu = {false}
		navClass      = "bg-primary-1000 sm:px-2 xl:px-4"
		{navStatus}
	>
		{#snippet brand()}
			<NavBrand aClass="space-x-0 space-r-1 xl:space-r-3 xl:mr-12" href="/">
				<img
					class = "xl:me-1 h-12 sm:h-12"
					alt   = "Tabroom Logo"
					src   = "/img/tabroom-sparky.png"
				/>
				<div>
					<h1
						class="
							whitespace-nowrap text-xl xl:text-3xl font-semibold
							text-secondary-25
						"
					>
						TABROOM.COM
					</h1>
					<div class="text-xs text-warning-400 italic font-medium">
						National Speech & Debate Association
					</div>
				</div>
			</NavBrand>
		{/snippet}

		<NavUl class="order-1 pt-2 items-start" {activeUrl}>
			<NavLi
				class="space-x-4 xl:space-x-8"
				aClass="
					text-neutral-100
					hover:text-warning-200 hover:underline hover:decoration-secondary-100
					hover:underline-offset-4 px-2 hover:text-secondary-200
				"
				href="/">Home
			</NavLi>

			<NavLi
				class="space-x-4 md:space-x-4 xl:space-x-8"
				aClass="
					text-neutral-100
					hover:text-warning-200 hover:underline
					hover:decoration-secondary-100 hover:underline-offset-4 px-2
				"
				href="/circuits">Circuits
			</NavLi>

			<NavLi
				class="space-x-4 md:space-x-4 xl:space-x-8"
				aClass="
					text-neutral-100
					hover:text-warning-200 hover:underline
					hover:decoration-secondary-100 hover:underline-offset-4 px-2
				"
				href="/results">Results</NavLi
			>

			<NavLi
				class="space-x-4 md:space-x-4 xl:space-x-8"
				aClass="
					text-neutral-100
					hover:text-warning-200 hover:underline
					hover:decoration-secondary-100 hover:underline-offset-4 px-2
				"
				href="/paradigms">Paradigms</NavLi
			>
		</NavUl>

		{#snippet navSlotBlock()}
			<div class="flex items-center space-x-1 md:order-2 md:mt-1 md:mr-12">
				<Button
					class="me-1 rounded-lg bg-neutral-400 p-2.5 text-sm text-gray-50
						hover:bg-neutral-200 focus:outline-none focus:ring-4 focus:ring-gray-200 md:hidden
						dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
				>
					<SearchOutline class="h-5 w-5" />
				</Button>
				<div class="relative hidden md:block">
					<div
						class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3"
					>
						<SearchOutline class="h-4 w-4" />
					</div>
					<Input
						id          = "search-navbar"
						class       = "bg-neutral-400 ps-10 text-primary-900"
						placeholder = "Ctrl-s to search..."
					/>
				</div>
			</div>

			<div class="items-center space-x-1 md:order-3 md:mr-4 md:ml-4">
				<div>
					<div class="flex flex-row items-end align-middle">
						<a
							class="
								text-md
								text-primary-800
								bg-gray-100 dark:bg-gray-600 dark:text-gray-300
								hover:text-secondary-200 hover:bg-secondary-500
								relative flex items-center justify-center
								w-9 h-9
								px-2 mr-2
								border rounded-full
							"
							href="/user/home"
						>
							<HomeSolid />
						</a>
						<a
							class="
								text-primary-900 text-md
								bg-gray-100 dark:bg-gray-600 dark:text-gray-300
								relative flex items-center justify-center
								hover:text-secondary-200 hover:bg-secondary-500
								w-9 h-9 px-2 mr-2
								rounded-full border
							"
							href="/user/inbox"
						>
							<EnvelopeSolid />
						</a>
						<Avatar
							class="
								hover:text-secondary-200 hover:bg-secondary-500
								text-lg
								text-primary-900
								w-9 h-9 border font-semibold
							"
							dot={{ color: 'green' }}
							onclick={dropdownUser.toggle}
						>
							{#if sessionData && sessionData.personFirst && sessionData.personFirst.length > 0}
								{Array.from(sessionData?.personFirst)[0]}{Array.from(
									sessionData?.personLast,
								)[0]}
							{/if}
						</Avatar>
						<div class="relative">
							<Dropdown
								class="absolute -left-[110px] top-[14px] md:-left-[160px] "
								closeDropdown={closeDropdownUser}
								dropdownStatus={dropdownUserStatus}
								params={{ y: 0, duration: 200, easing: sineIn }}
							>
								<DropdownHeader class="px-4 py-2">
									<span class="block text-sm text-gray-900 dark:text-white">
										{sessionData.personFirst}
										{sessionData.personMiddle}
										{sessionData.personLast}
									</span>
									<span class="block truncate text-sm font-medium"
										>{sessionData.email}</span
									>
								</DropdownHeader>
								<DropdownUl>
									<DropdownLi href="/user/home">Home</DropdownLi>
									<DropdownLi href="/user/inbox">Message Inbox</DropdownLi>
									<DropdownLi href="/user/dashboard">Dashboard</DropdownLi>
									<DropdownLi href="/user/judge/ballots">Ballots</DropdownLi>
									<DropdownLi href="/user/proile">Account Profile</DropdownLi>
									<DropdownLi href="/user/password">Change Password</DropdownLi>
								</DropdownUl>
								<DropdownFooter
									class="px-4 py-2 pt-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
									>Sign out</DropdownFooter
								>
							</Dropdown>
						</div>
					</div>
					<div
						class="text-xs text-center italic
						pt-1
						text-warning-400 font-medium
						underline-offset-2 underline decoration-gray-300"
					>
						{sessionData.email || sessionData.message}
					</div>
				</div>
				<NavHamburger {toggleNav} />
			</div>
		{/snippet}
	</Navbar>
</div>
