import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { sveltePreprocess } from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [vitePreprocess(), sveltePreprocess()],

	kit: {
		adapter: adapter(),
		alias: {
			$config: './config/config.js',
		},
	},

	compilerOptions: {
		experimental: {
			async: true,
		},
	},
};

export default config;
