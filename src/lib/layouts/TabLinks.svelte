<script lang='ts' module>

	export type TabLink = {
		route            : string,
		label            : string,
		sort?            : number,
		matchPatterns?    : Array<string>,
		defaultSelected? : boolean,
		selected?        : boolean,
		tabClass?        : string,
	};

</script>
<script lang='ts'>

	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	let { tabs }: {tabs: TabLink[]} = $props();

	let activeClass = `
		active
		text-primary-700
		bg-back-50
		hover:text-primary-800 hover:bg-back-100
		dark:bg-back-800 dark:text-primary-500
		hover:dark:text-warning-200 hover:dark:bg-back-700
	`;

	let inactiveClass = `
		text-black
		bg-back-200
		dark:bg-back-800 dark:text-primary-500
	`;

	const processedTabs:TabLink[] = $derived(tabs.map( (tab) => {

		// Reset is necessary or state won't change
		tab.selected = false;
		tab.tabClass = inactiveClass;

		if (tab.label !== 'Main' && page.url.pathname.includes(tab.route)) {
			tab.selected = true;
			tab.tabClass = activeClass;
		} else if (tab.matchPatterns && tab.matchPatterns.length > 0) {
			tab.matchPatterns.forEach ( (matchPattern) => {
				if (page.url.pathname.includes(matchPattern)) {
					tab.selected = true;
					tab.tabClass = activeClass;
				}
			});
		}

		// Exact matches should always win.
		if (page.url.pathname === tab.route) {
			tab.selected = true;
			tab.tabClass = activeClass;
		}

		return tab;
	}));

</script>

<ul
	class = 'flex space-x-2 rtl:space-x-reverse'
	role  = 'tablist'
>
	{#each processedTabs.sort((a, b) => (a.sort || 0) - (b.sort || 0)) as tab (tab.route)}
		<li class='group focus-within:z-10' role='presentation'>
			<a
				class ='{ tab.tabClass }
					inline-block p-2 px-4
					rounded-t-sm
					text-sm text-center
					disabled:cursor-not-allowed
					font-semibold
					hover:bg-secondary-100
				'
				aria-selected = '{ page.url.pathname.includes(tab.route) || tab.defaultSelected }'
				href          = {resolve(tab.route, {})}
				role          = 'tab'
				title         = '{ tab.route } {page.url.pathname}'
				type          = 'button'
			>
				{tab.label}
			</a>
		</li>
	{/each}
</ul>