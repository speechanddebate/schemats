<script lang='ts' module>
	export type TabLink = {
		route  : string,
		label  : string,
		active : boolean,
		sort?  : number,
	};
</script>
<script lang='ts'>

	import { resolve } from '$app/paths';
	let { tabs }: {tabs: TabLink[]} = $props();

	let activeClasses = `
		active
		text-warning-6:w
		00 bg-back-50
		hover:text-warning-400 hover:bg-back-100
		dark:bg-back-800 dark:text-primary-500
		hover:dark:text-warning-200 hover:dark:bg-back-700
		border-b-2 border-warning-400
	`;

	let inactiveClasses = `
		active
		text-primary-600 bg-back-50
		hover:text-primary-800 hover:bg-back-100
		dark:bg-back-800 dark:text-primary-500
		hover:dark:text-warning-200 hover:dark:bg-back-700
		border-b-2 border-bg-back-200 dark:bg-back-800
	`;


</script>

<ul
	class='flex space-x-2 rtl:space-x-reverse'
	role='tablist'
>
	{#each tabs.sort((a, b) => (a.sort || 0) - (b.sort || 0)) as tab (tab.route)}
		<li class='group focus-within:z-10' role='presentation'>
			<a
				class = '{tab.active ? activeClasses : inactiveClasses}
					inline-block p-2 px-4
					rounded-t-sm
					text-sm text-center
					disabled:cursor-not-allowed
					font-semibold
				'
				aria-selected = '{tab.active || false}'
				href          = {resolve(tab.route, {})}
				role          = 'tab'
				type          = 'button'
			>
				{tab.label}
			</a>
		</li>
	{/each}
</ul>