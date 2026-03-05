<script lang='ts'>

	// Component to apply Tabroom standard formatting to the Tabs Flowbite
	// module.

    import type { TabsProps } from 'flowbite-svelte';
	import {Tabs} from 'flowbite-svelte';

	let {
		children,
		contentClass,
		classes = { content: '' },
		...restProps
	}: TabsProps = $props();

	// Provide default values where there were none from the upstream.
	let defaultedClasses = $derived.by( () => {
		return {
			content: contentClass || 'mt-0 border-t-2 border-secondary-400  dark:bg-secondary-700 rounded',
			divider: `h-px bg-secondary-400 dark:bg-secondary-700`,
			...classes,
		};
	});

</script>

	<!-- lib/layouts/Tabs.svelte -->
	<Tabs
		classes = {defaultedClasses}
		{ ...restProps }
	>
		{@render children?.()}
	</Tabs>

<!--
@component
[Go to docs](https://flowbite-svelte.com/)
## Type
[TabsProps](https://github.com/themesberg/flowbite-svelte/blob/main/src/lib/types.ts#L1702)
## Props
@prop children
@prop tabStyle = "none"
@prop ulClass
@prop contentClass
@prop divider = true
@prop class: className
@prop classes
@prop ...restProps
-->