<script lang="ts">
    import Sidebar from './sidebar.svelte';
    import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

</script>
{@render children()}
<Sidebar/>