<script lang="ts" module>
import { defineMeta } from '@storybook/addon-svelte-csf';
import Ads from '$lib/components/ads.svelte';
import type { HomepageAd } from '$indexcards/schemas';
import { faker } from '@faker-js/faker';

const sampleAds: HomepageAd[] = [
	{
		url: faker.internet.url(),
		imgSrc: faker.image.url(),
		background: faker.color.rgb({ format: 'hex' }),
	},
	{
		url: '',
		imgSrc: faker.image.url(),
		background: undefined,
	},
];

const { Story } = defineMeta({
	component: Ads,
	args: {
		ads: sampleAds,
	},
});
</script>

<Story name="Default" />