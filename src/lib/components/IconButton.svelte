<script lang="ts">
    import { Tooltip } from 'flowbite-svelte';
	import type { Snippet } from 'svelte';

type Color = 'default' | 'red' | 'green' | 'blue' | 'purple';
type Variant = 'outline' | 'solid';

const {
	label,
	onclick,
	disabled = false,
	children,
	class: classOverride,
	color = 'default',
	variant = 'outline',
}: {
	label: string,
	onclick?: () => void | Promise<void>,
	disabled?: boolean,
	children: Snippet,
	class?: string,
	color?: Color,
	variant?: Variant,
}= $props();

const styles = {
	default: {
		outline: 'border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-100',
		solid: 'border-slate-700 bg-slate-700 text-white hover:bg-slate-800',
	},
	red: {
		outline: 'border-red-700 text-red-700 hover:border-white hover:bg-red-700 hover:text-white',
		solid: 'border-red-700 bg-red-700 text-white hover:bg-red-800',
	},
	green:{
		outline: 'border-green-700 text-green-700 hover:border-white hover:bg-green-700 hover:text-white',
		solid: 'border-green-700 bg-green-700 text-white hover:bg-green-800',
	},
	blue: {
		outline: 'border-blue-700 text-blue-700 hover:border-white hover:bg-blue-700 hover:text-white',
		solid: 'border-blue-700 bg-blue-700 text-white hover:bg-blue-800',
	},
	purple: {
		outline: 'border-purple-700 text-purple-700 hover:border-white hover:bg-purple-700 hover:text-white',
		solid: 'border-purple-700 bg-purple-700 text-white hover:bg-purple-800',
	},
} as const;

</script>

<button
	class={[
		`rounded border-2 p-1 transition`,
		'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-inherit',
		'hover:cursor-pointer',
		styles[color][variant],
		classOverride,
	]}
	aria-label={label}
	{disabled}
	onclick={onclick}
>
	{@render children()}
</button>
{#if label}
	<Tooltip placement="bottom">{label}</Tooltip>
{/if}

<style>
</style>
