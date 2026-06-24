<script lang="ts">
	import { getPerson } from '$lib/helpers/SessionContext.svelte';
    import SidebarLink from './SidebarLink.svelte';
	import { getConfigContext } from '$lib/config/AppConfig';

	const config = $derived(getConfigContext());

	const person = $derived(getPerson());
</script>

<div class="sidenote">
	<h4>Judging</h4>
	<SidebarLink
		href={`${config.classicUrl}/user/judge/index.mhtml`}
		size="half"
	>Upcoming</SidebarLink>

	<SidebarLink
		href="/user/judge/history"
		size="half"
	>Judging History</SidebarLink>

	<SidebarLink
		href={`${config.classicUrl}/user/judge/conflicts.mhtml`}
		size="half"
	>Standing Conflicts</SidebarLink>

	<SidebarLink
		href={`${config.classicUrl}/user/judge/paradigm.mhtml`}
		size="half"
	>Your Paradigm</SidebarLink>

	<SidebarLink
		href="/user/judge/certifications"
		size="half"
	>Judge Certifications</SidebarLink>

	<SidebarLink
		href={`${config.classicUrl}/user/judge/hire.mhtml?person_id=${person?.id ?? ''}`}
		size="half"
	>Offer Hired Judging</SidebarLink>
</div>
