import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapter from '@sveltejs/adapter-node';
import { sveltePreprocess } from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [vitePreprocess(), sveltePreprocess()],

	kit: {
		 adapter: adapter(),
	},

	compilerOptions: {
		experimental: {
			async: true,
		},
	},
};

export default config;
