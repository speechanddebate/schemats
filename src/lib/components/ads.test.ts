import { render } from '@testing-library/svelte';
import Ads from './ads.svelte';
import type { HomepageAd } from '$indexcards/schemas';

describe('Ads component', () => {
	const sampleAds: HomepageAd[] = [
		{
			url: 'https://example.com',
			imgSrc: 'https://example.com/ad1.png',
			background: '#FFEE00',
		},
	];

	it('applies background color style if provided', () => {
		const { container } = render(Ads, { props: { ads: sampleAds } });
		const img = container.querySelector('img');
		expect(img).toBeTruthy();
		// The style property is a string, so we check for the color substring
		expect(img && img.style.backgroundColor).toBe('rgb(255, 238, 0)');
	});

	it('renders nothing if ads array is empty', () => {
		const { container } = render(Ads, { props: { ads: [] } });
		expect(container.querySelector('img')).toBeNull();
		expect(container.textContent?.trim()).toBe('');
	});
});
