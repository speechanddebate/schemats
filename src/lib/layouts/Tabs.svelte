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

	classes.content = contentClass || 'mt-0 border-t-2 border-secondary-400  dark:bg-secondary-700 rounded';
	classes.divider = `h-px bg-secondary-400 dark:bg-secondary-700`;

</script>

	<Tabs
		classes = {classes}
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