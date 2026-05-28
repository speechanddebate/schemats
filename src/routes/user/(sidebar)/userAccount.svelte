<script lang="ts">
	import config from '$config';
	import SidebarLink from './sidebarLink.svelte';
</script>

<div class="sidenote">
	<h4>Your Account</h4>

	<SidebarLink
		href={`${config.LEGACY_URL}/user/unfollow.mhtml`}
		variant="secondary"
	> Edit Live Updates/Parent Memos </SidebarLink>

	<SidebarLink
		href={`${config.LEGACY_URL}/user/chapter/create.mhtml`}
		variant="secondary"
	> Create a new school/team </SidebarLink>

	<SidebarLink
		href={`${config.LEGACY_URL}/user/tourn/request.mhtml`}
		variant="secondary"
	> Request a new tournament </SidebarLink>

	<SidebarLink
		href="/user/judge/search"
		variant="secondary"
	> Link your account to a judge </SidebarLink>

	<SidebarLink
		href={`${config.LEGACY_URL}/user/student/search.mhtml`}
		variant="secondary"
	> Link your account to a competitor </SidebarLink>
</div>