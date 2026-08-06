
<script lang="ts">
	import type { UserJudgesLiveDocs200Item } from '$indexcards/schemas';
	const { livedocs }: { livedocs: UserJudgesLiveDocs200Item[] } = $props();
</script>
<h6 class='font-semibold border-b-8 border-primary-600 pb-2 mt-4'>
	Tournament Live Docs
</h6>

{#each livedocs as doc (doc.url)}
	<div class="py-0.5 wrap bg-surface-400 border-x border-surface-600">
		<div class="flex flex-row px-0.5 pl-2 italic">
			{doc.tournName}
		</div>
		<div class="flex flex-row w-full">
			<span class="w-eighth font-semibold px-0.5 pl-2">
				{doc.categoryAbbr}
			</span>
			<a
				class  = "bg-transparent border-t-0 text-primary-700 underline underline-offset-2 w-seveneighths"
				href   = "{doc.url}"
				target = "_blank"
			>
				<div class="p-0 m-0 flex flex-row">
					<span class="w-fivesixths pl-2">
						{doc.caption || 'Live Doc'}
					</span>

					<span class="w-sixth text-center">
						<span class="fa fa-sm fa-file buttonwhite bluetext">
						</span>
					</span>
				</div>
			</a>
		</div>
	</div>
{/each}
