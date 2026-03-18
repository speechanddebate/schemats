<script lang="ts">
	import { Carousel } from 'flowbite-svelte';
	import { createRestAds } from '$indexcards';
	import type { RestAds200Item } from '$indexcards/schemas';
	import type { HTMLImgAttributes } from 'svelte/elements';

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
			src: ad.imgSrc,
			style: ad.background ? `background-color: ${ad.background};` : undefined,
		})),
	);
</script>

{#if carouselImages.length > 0}
	<Carousel
		class="!h-[100px] w-full"
		aria-label='Homepage advertisements'
		duration={7000}
		images={carouselImages}
		imgClass={activeAd?.url ? 'cursor-pointer' : ''}
		slideFit="contain"
		bind:index={activeIndex}
	/>
{/if}
