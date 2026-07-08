import type { StorybookConfig } from '@storybook/sveltekit';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
	'stories': [
		'../src/**/*.mdx',
		'../src/**/*.stories.@(js|ts|svelte)',
	],
	'addons': [
		'@storybook/addon-svelte-csf',
		'@storybook/addon-vitest',
		'@storybook/addon-a11y',
		'@storybook/addon-docs',
	],
	staticDirs: ['../static'],
	'framework': '@storybook/sveltekit',
	env: (existing) => ({
		...existing,
	}),
	async viteFinal(og) {
		return mergeConfig(og, {
			resolve: {
				alias: {
					'$app/env/public': '/src/storybook/mocks/env-public.ts',
				},
			},
		});
	},
};
export default config;