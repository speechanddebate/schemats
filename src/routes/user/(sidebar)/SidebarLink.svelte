<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';

	type Props = {
		children: Snippet;
		href?: string;
		selected?: boolean;
		variant?: 'primary' | 'secondary';
		class?: string;
		size?: 'full' | 'half';
	};
	let { children, ...props }: Props = $props();

	//default to selected if href matches current page
	const isSelected = $derived(
		props.selected ??
			(props.href ? page.url.pathname === props.href : false)
	);

</script>

<a
	class={`sidebar-btn ${props.size ?? 'full'} ${props.variant ?? 'primary'} ${isSelected ? 'selected' : ''} ${props.class ?? ''}`}
	href={props.href}
>
	{@render children()}
</a>

<style>
.sidebar-btn.primary {
	background: var(--color-primary-50);
}
.sidebar-btn.secondary {
	background: var(--color-secondary-200);
}
.sidebar-btn.secondary:hover,
.sidebar-btn.selected.secondary {
	background: var(--color-secondary-400);
}
.sidebar-btn.primary:hover,
.sidebar-btn.selected.primary {
	background: var(--color-primary-700);
	color: #ffffff;
}

</style>
