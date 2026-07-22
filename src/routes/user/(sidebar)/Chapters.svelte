<script lang="ts">
import { CLASSIC_URL } from '$app/env/public';
import type { UserChapter } from '$indexcards/schemas';
import SidebarLink from './SidebarLink.svelte';

let { chapters }: { chapters: UserChapter[] | null } = $props();
</script>
{#if chapters && chapters.length > 0}
<div class="sidenote">
	<h4>Chapters</h4>

	{#each chapters as chapter (chapter.id)}
		<SidebarLink
		href={`${CLASSIC_URL}/user/chapter/tournaments.mhtml?chapter_id=${chapter.id}`}
	>
	{chapter.name}
	</SidebarLink>
	{/each}
</div>
{/if}
