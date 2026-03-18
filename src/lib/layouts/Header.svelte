<script lang="ts">

	import { resolve } from '$app/paths';
	import { invalidateAll } from '$app/navigation';
	import { slide } from 'svelte/transition';
	import { sineIn } from 'svelte/easing';
	import { page } from '$app/state';

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
		DropdownGroup,
		Button,
		Indicator,
	} from 'flowbite-svelte';
	import {
		HomeSolid,
		EnvelopeSolid,
		UserSolid,
		ArrowRightToBracketOutline,
		ChalkboardSolid, FileCheckSolid,
	}  from 'flowbite-svelte-icons';

	import { getActivePerson, getRootPerson, isAuthenticated, isSuSession } from '$lib/context/SessionContext.svelte';

	//notification placeholders for now
	const { logoutFn, notificationCount = 0 } = $props();

	const activePerson = $derived(getActivePerson());
	const rootPerson = $derived(getRootPerson());

	let activeUrl = $derived(page.url.pathname);
	const loginRedirect = $derived(
		encodeURIComponent(`${page.url.pathname}${page.url.search}`)
	);
	const loginHref = $derived(`/user/login?redirect=${loginRedirect}`);
	const hideAuthControls = $derived(page.url.pathname === '/user/login');

	let loggingOut = $state(false);
	const logout = async (event: Event) => {
		loggingOut = true;
		event?.preventDefault();
		await logoutFn();
		await invalidateAll(); // Force reload +layout.server.ts
		loggingOut = false;
	};

	// Page status updates do not ordinarily trigger reactivity so this is
	// apparently necessary to keep it updated

	$effect( () => {
		activeUrl = page.url.pathname;
	});

</script>

<div>
	<Navbar
		class = 'items-start flex-nowrap flex-row
			bg-linear-to-b from-primary-1000 to-primary-800
			sm:px-2 xl:px-4'
		breakpoint="lg"
		fluid = {true}
		navContainerClass = 'flex-nowrap py-1 justify-stretch'
	>
		<NavBrand
			class = 'flex-wrap mt-2 mb'
			href  = {resolve('/', {})}
		>
			<div class="flex nowrap
				p-0 m-0
				justify-center items-center
				ms-4 ps-2
			">
				<img
					class = "
						xl:h-[70.4px] xl:w-[48.3px]
						xl:pb-1
						lg:h-14 lg:w-[38.6px]
						md:h-[42.2px] md:w-7.25
						h-[28.2px] w-[19.3px]
						mr-0.5
						md:mr-1
					"
					alt   = "Tabroom Logo"
					src   = "/img/tabroom-sparky.png"
				/>
				<div>
					<h1
						class="
						hidden sm:inline
							whitespace-nowrap font-semibold text-neutral-50
							text-[28px]
							md:text-[36px] md:leading-4 md:tracking-[0.02em]
							lg:text-[42px] lg:tracking-[.02em] lg:py-1 lg:leading-7 pe-2
							xl:tracking-wider xl:text-[2.8rem] xl:py-1 xl:leading-8 xl:pb-1
							md:block
						"
					>
						TABROOM.COM
					</h1>
					<div class="
						text-secondary-300 italic w-auto font-semibold
						sm:inline
						md:text-[12px] md:ms-1 md:pb-1
						lg:text-[14px] lg:ms-1 lg:pb-1
						xl:text-xs xl:text-[15px] xl:tracking-[0.02em] xl:pl-1
						hidden
					">
						National Speech &amp; Debate Association
					</div>
				</div>
			</div>

		</NavBrand>
		<NavHamburger />
		<NavUl
			class = 'items-start text-base md:text-center
					order-2'
			{activeUrl}
			classes={{
				ul: 'flex-col rtl:space-x-reverse flex-row md:flex md:justify-around md:p-2 md:text-xs md:font-medium lg:p-2 lg:mt-0 lg:text-sm xl:mt-0 hidden',
				active: 'text-primary-100 decoration font-semibold decoration-error-300 underline decoration-solid decoration underline-offset-4 hover:bg-amber-50 hover:text-error-900 hover:decoration-primary-500 md:ps-2 md:pe-2 lg:ps-2 lg:pe-2 lg:w-[12ex] xl:ps-2 xl:pe-2 xl:w-[12ex] ',
				nonActive: 'text-secondary-100 tracking-wide hover:font-semibold hover:bg-warning-600 md:ps-2 md:pe-2 lg:ps-2 lg:pe-2 lg:w-[11ex] xl:ps-2 xl:pe-2 xl:w-[12ex]',
			}}
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
			>Paradigm</NavLi>

			<NavLi
				href  = "/page/help"
			>Help</NavLi>
		</NavUl>

		<div class="flex grow w-1/12 order-2">
		</div>

		<!-- The Flowbite Svelte Search module proved to be a real PITA of obscurity -->
		<div id="search-bar"
			class="text-stone-200 mx-1
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
				<div class="absolute inset-y-0 inset-s-0 flex items-center ps-3 pointer-events-none">
					<svg
						class       = "w-4 h-4 text-secondary-100"
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
						bg-primary-700
						text-warning-200
						border border-primary-500
						focus:border-warning-400
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

		<div id="auth-controls"
			class="
				order-last ml-auto mr-1
				w-auto
				grow-0 shrink-0
				flex items-center justify-end
			"
			>
			{#if hideAuthControls} 	<!-- Intentionally hide auth controls on the login page -->
			{:else if isAuthenticated()}
					<div class='py-3 w-auto'>
						<div class="flex flex-col items-end pb-1">
							<div class="flex flex-row flex-nowrap items-center justify-end">
						<Button
							class="
								hidden md:inline
								mr-2
								bg-stone-50
								hover:bg-stone-50!
								active:bg-stone-50!
								text-primary-800
								hover:text-warning-600
								border
								p-2
							"
							href={resolve('/user/home', {})}
							pill={true}
						>
							<HomeSolid class="h-6 w-6" />
						</Button>
						<Button
							class="
								hidden md:inline
								mr-2
								bg-stone-50
								hover:bg-stone-50!
								active:bg-stone-50!
								text-primary-800
								hover:text-warning-600
								border
								p-2
								relative
							"
							href={resolve('/user/inbox', {})}
							pill={true}
						>
							<EnvelopeSolid class="h-6 w-6" />
							{#if notificationCount > 0}
								<Indicator color="red" placement="top-right" size="xl">
									<span class="text-xs font-bold text-white">{notificationCount > 99 ? '99+' : notificationCount}</span>
								</Indicator>
							{/if}

						</Button>
							<div
								class="account-details cursor-pointer hidden xl:flex flex-col leading-tight mr-2 text-right">
								<span class="text-xs font-semibold text-stone-100 whitespace-nowrap">
									{rootPerson?.firstName} {rootPerson?.lastName}
								</span>
								<span class="text-[10px] italic text-secondary-200 whitespace-nowrap">
									{rootPerson?.email}
								</span>
								{#if isSuSession()}
									<span class="text-[10px] italic text-warning-400 whitespace-nowrap">
										as {activePerson?.email}
									</span>
								{/if}
							</div>
							<Avatar
								class = "
									account-details
									cursor-pointer
									lg:text-lg
									text-md
									bg-stone-50
									text-primary-700
									hover:bg-primary-700
									hover:text-amber-50
									border-2  border-warning-400
									w-12 h-12
									font-bold"
							>{rootPerson?.firstName?.[0]}{rootPerson?.lastName?.[0]}</Avatar>
							</div>
							<span class="mt-1 text-[10px] italic text-secondary-200 xl:hidden text-right">
								{rootPerson?.email}
							</span>
							<div class="relative">
								<Dropdown
									transition = {slide}
									triggeredBy = ".account-details"
								>
									<DropdownHeader
										class = "block w-full px-2 pt-1 border-b border-warning-700 text-primary-1000"
									>
											<span class="block text-xs font-semibold">
												{rootPerson?.firstName} {rootPerson?.lastName}
											</span>
											<span class="block text-[10px] italic font-medium">
												{rootPerson?.email}
											</span>
											{#if isSuSession()}
											<span class="block text-[10px] italic font-medium">
												as {activePerson?.email}
											</span>
											{/if}
									</DropdownHeader>
									<DropdownGroup>
										<DropdownItem
										class="text-sm hover:bg-gray-200 dark:hover:bg-neutral-600 py-2 flex items-center gap-2"
										href={resolve('/user/home', {})}
										><HomeSolid class="w-4 h-4" />Home</DropdownItem>
									<DropdownItem
											class="text-sm hover:bg-gray-200 dark:hover:bg-neutral-600 py-2 flex items-center gap-2"
											href={resolve('/user/inbox', {})}
											>
											<span class="relative inline-flex items-center">
												<EnvelopeSolid class="w-4 h-4" />
												{#if notificationCount > 0}
													<Indicator color="red" placement="top-right" size="xs"/>
												{/if}
											</span>
											Inbox
									</DropdownItem>
									<DropdownItem
										class="text-sm hover:bg-gray-200 dark:hover:bg-neutral-600 py-2 flex items-center gap-2"
										href={resolve('/user/judge/ballots', {})}
										><FileCheckSolid class="w-4 h-4" />Ballots</DropdownItem>
									<DropdownItem
										class="text-sm hover:bg-gray-200 dark:hover:bg-neutral-600 py-2 flex items-center gap-2"
										href={resolve('/user/dashboard', {})}
										><ChalkboardSolid class="w-4 h-4" />Dashboard</DropdownItem>
									<DropdownItem
										class="text-sm hover:bg-gray-200 dark:hover:bg-neutral-600 py-2 flex items-center gap-2"
										href={resolve('/user/profile', {})}
										><UserSolid class="w-4 h-4" />Profile</DropdownItem>
									</DropdownGroup>
									<DropdownGroup>
									{#if isSuSession()}
									<DropdownItem
										class="
												w-full
												text-left
												text-sm
												hover:bg-gray-200
												dark:hover:bg-neutral-600
												py-2
												flex
												items-center
												gap-2"
										><ArrowRightToBracketOutline class="w-4 h-4" />End Su Session</DropdownItem>
									{/if}
									<DropdownItem
										class="
												w-full
												text-left
												text-sm
												hover:bg-gray-200
												dark:hover:bg-neutral-600
												py-2
												flex
												items-center
												gap-2"
										disabled={loggingOut}
										onclick={logout}
										><ArrowRightToBracketOutline class="w-4 h-4" />{loggingOut ? 'Logging out...' : 'Logout'}</DropdownItem>
									</DropdownGroup>
								</Dropdown>
							</div>
						</div>
					</div>
			{:else} <!-- Logged out state -->
			<div class="items-center
				justify-around
				w-auto flex
			">
				<a
					id = "signup-menu"
					class='
						text-stone-50
						bg-warning-500
						hover:bg-warning-600
						focus:ring-4 focus:outline-hidden focus:ring-warning-300
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
						transitionParams = {{
							y: 0,
							duration: 200,
							easing: sineIn,
						}}
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
						focus:ring-4 focus:outline-hidden focus:ring-success-300
						font-medium rounded-md text-sm
						px-2 py-1.5
						text-center
						border border-success-900
						hover:border-success-300
					'
					href={resolve(loginHref, {})}
				>
					LOGIN
				</a>
			</div>

			{/if}
		</div>
	</Navbar>
</div>