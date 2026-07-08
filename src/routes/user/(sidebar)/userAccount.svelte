<script lang="ts">
	import { CLASSIC_URL } from '$app/env/public';
	import SidebarLink from './SidebarLink.svelte';
</script>

<div class="sidenote">
	<h4>Your Account</h4>

	<SidebarLink
		href={`${CLASSIC_URL}/user/unfollow.mhtml`}
		variant="secondary"
	> Edit Live Updates/Parent Memos </SidebarLink>

	<SidebarLink
		href={`${CLASSIC_URL}/user/chapter/create.mhtml`}
		variant="secondary"
	> Create a new school/team </SidebarLink>

	<SidebarLink
		href={`${CLASSIC_URL}/user/tourn/request.mhtml`}
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