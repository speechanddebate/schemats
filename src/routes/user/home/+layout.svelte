<script lang="ts">
	import Sidebar from '$lib/layouts/Sidebar.svelte';
	import UserAccount from '../(sidebar)/userAccount.svelte';
	import Judging from '../(sidebar)/Judging.svelte';

	let { children } = $props();
</script>

<div class="flex flex-col lg:flex-row">
	<div class="main">
		{@render children()}
	</div>
	<Sidebar>
		<Judging />
		<UserAccount />
	</Sidebar>
</div>
