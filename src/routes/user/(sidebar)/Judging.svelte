<script lang="ts">
	import config from '$config';
	import { getPerson } from '$lib/helpers/SessionContext.svelte';
    import SidebarLink from './sidebarLink.svelte';

	const person = $derived(getPerson());
</script>

<div class="sidenote">
	<h4>Judging</h4>

	<SidebarLink
		href={`${config.LEGACY_URL}/user/judge/conflicts.mhtml`}
		size="half"
	>Standing Conflicts</SidebarLink>

	<SidebarLink
		href={`${config.LEGACY_URL}/user/judge/paradigm.mhtml`}
		size="half"
	>Your Paradigm</SidebarLink>

	<SidebarLink
		href={`${config.LEGACY_URL}/user/judge/certifications.mhtml`}
		size="half"
	>Judge Certifications</SidebarLink>

	<SidebarLink
		href={`${config.LEGACY_URL}/user/judge/hire.mhtml?person_id=${person?.id ?? ''}`}
		size="half"
	>Offer Hired Judging</SidebarLink>
</div>
