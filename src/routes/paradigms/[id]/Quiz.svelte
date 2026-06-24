<script lang="ts">
	import type { QuizOutput } from '$indexcards/schemas';
	import { showDateTime } from '$lib/helpers/dt';
	import { Spinner } from 'flowbite-svelte';
	import { getPerson } from '$lib/helpers/SessionContext.svelte';
	import { getConfigContext } from '$lib/config/AppConfig';

	const person = $derived(getPerson());
	const config = $derived(getConfigContext());

	let { quiz, variant }: { quiz: QuizOutput, variant: 'paradigm' | 'self' } = $props();
	let imgLoaded = $state(false);
	let imgError = $state(false);
</script>

<div class="rounded-lg border border-primary-200 bg-white p-4 shadow-sm">
	<div class="flex flex-wrap gap-4 justify-content-center">
		{#if quiz?.Badge?.imageUrl}
			<div class="flex-shrink-0 relative h-24 w-24 m-auto">
				{#if !imgLoaded && !imgError}
					<div class="absolute inset-0 flex items-center justify-center">
						<Spinner color="primary" />
					</div>
				{/if}

				<svelte:element
					this={quiz?.Badge?.link ? 'a' : 'div'}
					aria-label={quiz?.Badge?.link ? 'Link to certification' : undefined}
					href={quiz?.Badge?.link ?? undefined}
					rel={quiz?.Badge?.link ? 'noopener noreferrer' : undefined}
					target={quiz?.Badge?.link ? '_blank' : undefined}
				>
					<img
						class="rounded object-contain {imgLoaded ? '' : 'hidden'}"
						alt={quiz?.Badge?.altText || 'Certification badge'}
						onerror={() => (imgError = true)}
						onload={() => (imgLoaded = true)}
						src={quiz?.Badge?.imageUrl}
					/>
				</svelte:element>
			</div>
		{/if}
		<div
			style="flex:1 0 240px; min-width:0"
			class="flex flex-col justify-between"
		>
			<div class="w-full">
				{#if quiz.PersonQuizzes && quiz.PersonQuizzes.length > 0 && quiz.PersonQuizzes[0].updatedAt}
				{#if quiz.PersonQuizzes[0].approvedBy ?? 0 > 0}
					<p class="text-xs text-primary-600 text-right whitespace-nowrap">
						Confirmed: {showDateTime({
							dt: new Date(quiz.PersonQuizzes[0].updatedAt),
							tz: person?.tz || 'UTC',
							showTz   : true,
							joinWord : 'at',
						})}
					</p>
				{:else if quiz.PersonQuizzes[0].pending}
					<p class="text-xs text-yellow-600 text-right whitespace-nowrap">
						Pending
						</p>
				{:else}
					<p class="text-xs text-primary-600 text-right whitespace-nowrap">
						Updated at: {showDateTime({
							dt: new Date(quiz.PersonQuizzes[0].updatedAt),
							tz: person?.tz || 'UTC',
							showTz   : true,
							joinWord : 'at',
						})}
					</p>
				{/if}
				{:else if variant === 'self'}
					<p class="text-xs font-medium text-red-600 text-right">
						Certification not taken
					</p>
				{/if}
			</div>
			<div>
				<h3 class="text-lg font-semibold text-primary-900">
					{quiz?.label}
				</h3>
				{#if quiz?.description}
					<p class="mt-1 text-sm text-primary-600">
						{quiz?.description}
					</p>
				{/if}
			</div>
		</div>
	</div>
	{#if variant === 'self'}
		<div class="mt-4 flex">
			<a
				class="text-sm flex-grow text-center font-medium bg-primary-600
				hover:bg-primary-900 text-white px-2 py-1 rounded"
				href={`${config.classicUrl}/user/judge/quiz_take.mhtml?quiz_id=${quiz.id}`}
			>
			{#if quiz.PersonQuizzes &&quiz.PersonQuizzes.length > 0 && quiz.PersonQuizzes[0].updatedAt}
				View Quiz Details
			{:else}
				Take Quiz
			{/if}
			</a>
		</div>
	{/if}
</div>