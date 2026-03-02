import type { StorybookConfig } from '@storybook/sveltekit';

const config: StorybookConfig = {
	'stories': [
		'../src/lib/storybook/stories/**/*.stories.@(js|ts|svelte)',
	],
	'addons': [
		'@storybook/addon-svelte-csf',
		'@chromatic-com/storybook',
		'@storybook/addon-vitest',
		'@storybook/addon-a11y',
	],
	staticDirs: ['../static'],
	'framework': '@storybook/sveltekit',
};
export default config;