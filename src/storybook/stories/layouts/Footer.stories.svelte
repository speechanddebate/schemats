<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Footer from '$lib/layouts/Footer.svelte';

	const { Story } = defineMeta({
		title: 'Layouts/Footer',
		component: Footer,

		parameters: {
			session: null,
			a11y: {
				config: {
					rules: [
						// Flowbite Menu.svelte bug: SVG has role="button" tabindex="0" hardcoded
						// inside the NavHamburger's <button>, causing a false nested-interactive violation.
						// https://github.com/themesberg/flowbite-svelte/blob/main/src/lib/navbar/Menu.svelte
						{ id: 'nested-interactive', enabled: false },
					],
				},
			},
		},
	});

	</script>

	<Story
	name="Default"
	/>