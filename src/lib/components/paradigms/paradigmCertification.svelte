<script lang="ts">
	import type { ParadigmDetailsCertificationsItem } from '$indexcards/schemas';
	import { showDateTime } from '$lib/helpers/dt';
	import { Spinner } from 'flowbite-svelte';
	import { getPerson } from '$lib/context/SessionContext.svelte';

	const person = $derived(getPerson());

	let { cert }: { cert: ParadigmDetailsCertificationsItem } = $props();
	let imgLoaded = $state(false);
	let imgError = $state(false);
</script>

<div class="rounded-lg border border-primary-200 bg-white p-4 shadow-sm">
	<div class="flex gap-4">
		{#if cert.badge?.imageUrl}
			<div class="flex-shrink-0 relative h-24 w-24">
				{#if !imgLoaded && !imgError}
					<div class="absolute inset-0 flex items-center justify-center">
						<Spinner color="primary" />
					</div>
				{/if}

				<svelte:element
					this={cert.badge.link ? 'a' : 'div'}
					aria-label={cert.badge.link ? 'Link to certification' : undefined}
					href={cert.badge.link ?? undefined}
					rel={cert.badge.link ? 'noopener noreferrer' : undefined}
					target={cert.badge.link ? '_blank' : undefined}
				>
					<img
						class="rounded object-contain {imgLoaded ? '' : 'hidden'}"
						alt={cert.badge.altText || 'Certification badge'}
						onerror={() => (imgError = true)}
						onload={() => (imgLoaded = true)}
						src={cert.badge.imageUrl}
					/>
				</svelte:element>
			</div>
		{/if}

		<div class="flex-1 flex flex-col justify-between">
			<div>
				<h3 class="text-lg font-semibold text-primary-900">
					{cert.title}
				</h3>
				{#if cert.description}
					<p class="mt-1 text-sm text-primary-600">
						{cert.description}
					</p>
				{/if}
			</div>

			{#if cert.updatedAt}
				<p class="mt-3 text-xs text-primary-600 text-right whitespace-nowrap">
					Updated: {showDateTime({
						dt: new Date(cert.updatedAt),
						tz: person?.tz || 'UTC',
						showTz   : true,
						joinWord : 'at',
					})}
				</p>
			{/if}
		</div>
	</div>
</div>