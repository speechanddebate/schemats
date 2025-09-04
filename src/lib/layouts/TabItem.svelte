<script lang='ts'>

	// Component to apply Tabroom standard formatting to the Tabs Flowbite
	// module item list.

	import { type TabitemProps } from 'flowbite-svelte';
	import {TabItem} from 'flowbite-svelte';

	const tabStyle = `
		inline-block text-sm font-medium text-center disabled:cursor-not-allowed p-3 px-4 rounded-t-sm
		font-semibold
	`;

	const defaultActiveClass = `
		${ tabStyle }
		active text-primary-600 bg-gray-100 dark:bg-gray-800 dark:text-primary-500
	`;

	const defaultInactiveClass = `
		${ tabStyle }
		hover:text-primary-900 hover:bg-secondary-100
		dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300
	`;

	let {
		children,
		activeClass   = defaultActiveClass,
		inactiveClass = defaultInactiveClass,
		...restProps
	}: TabitemProps = $props();

</script>

	<TabItem
		activeClass   = { activeClass }
		inactiveClass = { inactiveClass }
		{ ...restProps }
	>
		{@render children?.()}
	</TabItem>
