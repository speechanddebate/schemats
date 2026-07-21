<script lang="ts">
  import type { Chapter } from '$indexcards/schemas';

  let { chapters }: { chapters: Chapter[] | null } = $props();
</script>

{#if chapters}
	<!-- TODO create one big beautiful component for displaying the list of chapters a person is admin of with links
	to the individual chapter pages -->
	<div class="w-full border border-gray-300 rounded-md p-4">
		<p class="font-bold text-xl mb-2">My Chapters</p>
		{#each chapters as chapter (chapter.id)}
			<div>
				<a href={`/user/home/chapters/${chapter.id}`}>{chapter.name}</a>
			</div>
		{/each}
	</div>
{/if}