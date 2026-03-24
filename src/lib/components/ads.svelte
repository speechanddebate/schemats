<script lang="ts">
	import { Carousel } from 'flowbite-svelte';
	import { createRestAds } from '$indexcards';
	import type { RestAds200Item } from '$indexcards/schemas';
	import type { HTMLImgAttributes } from 'svelte/elements';
	import { fly } from 'svelte/transition';

	const adsQuery = createRestAds();
	let activeIndex = $state(0);

	const adsData = $derived.by((): RestAds200Item[] => {
		const response = adsQuery.data;
		return response?.status === 200 ? response.data : [];
	});

	const activeAd = $derived.by((): RestAds200Item | null => adsData[activeIndex] ?? null);

	const carouselImages = $derived.by(
		(): HTMLImgAttributes[] => adsData.map((ad, index) => ({
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
		class      = 'w-full max-h-24'
		aria-label = 'Tabroom.com is Sponsored By'
		classes    = {{ slide: activeAd?.url ? 'cursor-pointer' : '' }}
		duration   = {6000}
		images     = {carouselImages}
		slideFit   = 'contain'
		transition = {fly}
		bind:index = {activeIndex}
	/>
{/if}
