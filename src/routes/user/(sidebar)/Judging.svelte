<script lang="ts">
	import { getPerson } from '$lib/helpers/SessionContext.svelte';
    import SidebarLink from './SidebarLink.svelte';
	import { CLASSIC_URL } from '$app/env/public';
	const person = $derived(getPerson());
</script>

<div class="sidenote">
	<h4>Judging</h4>
	<SidebarLink
		href={`${CLASSIC_URL}/user/judge/index.mhtml`}
		size="half"
	>Upcoming</SidebarLink>

	<SidebarLink
		href="/user/judge/history"
		size="half"
	>Judging History</SidebarLink>

	<SidebarLink
		href={`${CLASSIC_URL}/user/judge/conflicts.mhtml`}
		size="half"
	>Standing Conflicts</SidebarLink>

	<SidebarLink
		href={`${CLASSIC_URL}/user/judge/paradigm.mhtml`}
		size="half"
	>Your Paradigm</SidebarLink>

	<SidebarLink
		href="/user/judge/certifications"
		size="half"
	>Judge Certifications</SidebarLink>

	<SidebarLink
		href={`${CLASSIC_URL}/user/judge/hire.mhtml?person_id=${person?.id ?? ''}`}
		size="half"
	>Offer Hired Judging</SidebarLink>
</div>
