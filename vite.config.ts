import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';

export default ({ mode }) => {

	const env = loadEnv(mode, process.cwd())

	return defineConfig({
		plugins: [sveltekit()],
		test: {
			include: ['src/**/*.{test,spec}.{js,ts}']
		},
		server: {
			host: env.VITE_WEB_URL || 'localhost',
			port: parseInt(env.VITE_PORT) || 4000,
			hmr: {
				clientPort : parseInt(env.VITE_CLIENT_PORT) || 4001,
			},
			strictPort: false,
		},
		preview: {
			port       : parseInt(env.VITE_PREVIEW_PORT) || 4002,
			strictPort : false,
		},
	});
};
