<script lang="ts">
	import Sidebar from '$lib/layouts/Sidebar.svelte';
	import Chapters from '../(sidebar)/Chapters.svelte';
	import UserAccount from '../(sidebar)/userAccount.svelte';
	import Judging from '../(sidebar)/Judging.svelte';
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();
</script>

<div class="flex flex-col lg:flex-row">
	<div class="main">
		{@render children()}
	</div>
	<Sidebar>
		<Chapters chapters={data.chapters}/>
		<Judging />
		<UserAccount />
	</Sidebar>
</div>
