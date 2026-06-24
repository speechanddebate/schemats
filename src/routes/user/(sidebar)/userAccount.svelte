<script lang="ts">
	import { getConfigContext } from '$lib/config/AppConfig';
	const config = $derived(getConfigContext());
	import SidebarLink from './SidebarLink.svelte';
</script>

<div class="sidenote">
	<h4>Your Account</h4>

	<SidebarLink
		href={`${config.classicUrl}/user/unfollow.mhtml`}
		variant="secondary"
	> Edit Live Updates/Parent Memos </SidebarLink>

	<SidebarLink
		href={`${config.classicUrl}/user/chapter/create.mhtml`}
		variant="secondary"
	> Create a new school/team </SidebarLink>

	<SidebarLink
		href={`${config.classicUrl}/user/tourn/request.mhtml`}
		variant="secondary"
	> Request a new tournament </SidebarLink>

	<SidebarLink
		href='/user/judge/search'
		variant="secondary"
	> Link your account to a judge </SidebarLink>

	<SidebarLink
		href='/user/student/search'
		variant="secondary"
	> Link your account to a competitor </SidebarLink>
</div>