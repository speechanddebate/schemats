<script lang="ts">
	import { Carousel } from 'flowbite-svelte';
	import type { HomepageAd } from '$indexcards/schemas';
	import type { HTMLImgAttributes } from 'svelte/elements';
	import { fly } from 'svelte/transition';

	const { ads }: { ads: HomepageAd[] } = $props();
	let activeIndex = $state(0);

	const activeAd = $derived.by(() => ads[activeIndex] ?? null);

	const carouselImages = $derived.by(
		(): HTMLImgAttributes[] => ads.map((ad, index) => ({
			alt: `Advertisement ${index + 1}`,
			loading: 'lazy',
			onclick: ad.url
				? () => window.open(ad.url, '_blank', 'noopener,noreferrer')
				: undefined,
			src   : ad.imgSrc,
			style : ad.background ? `background-color : ${ad.background};` : undefined,
		})),
	);
</script>

{#if carouselImages.length > 0}
	<Carousel
		class      = 'w-full max-h-24 border-b-2 border-b-neutral-300 rounded-t-sm rounded-b-none'
		aria-label = 'Tabroom.com is Sponsored By'
		classes    = {{ slide: activeAd?.url ? 'cursor-pointer' : '' }}
		duration   = {6000}
		images     = {carouselImages}
		slideFit   = 'contain'
		transition = {fly}
		bind:index = {activeIndex}
	/>
{/if}
